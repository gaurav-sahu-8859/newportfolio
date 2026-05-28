import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   WebGL Water Simulation – exact jquery.ripples look
   Ping-pong float textures + normal-map lighting
   ═══════════════════════════════════════════════════ */

const VERT_SRC = `
  attribute vec2 vertex;
  varying vec2 coord;
  void main(){
    coord = vertex * 0.5 + 0.5;
    gl_Position = vec4(vertex, 0.0, 1.0);
  }
`;

const UPDATE_FRAG = `
  precision highp float;
  uniform sampler2D texture;
  uniform vec2 delta;
  varying vec2 coord;
  void main(){
    vec4 info = texture2D(texture, coord);
    vec2 dx = vec2(delta.x, 0.0);
    vec2 dy = vec2(0.0, delta.y);
    float avg = (
      texture2D(texture, coord - dx).r +
      texture2D(texture, coord + dx).r +
      texture2D(texture, coord - dy).r +
      texture2D(texture, coord + dy).r
    ) * 0.25;
    info.g += (avg - info.r) * 2.0;
    info.g *= 0.993;
    info.r += info.g;
    gl_FragColor = info;
  }
`;

const DROP_FRAG = `
  precision highp float;
  uniform sampler2D texture;
  uniform vec2 center;
  uniform float radius;
  uniform float strength;
  varying vec2 coord;
  void main(){
    vec4 info = texture2D(texture, coord);
    float d = distance(coord, center);
    if(d < radius){
      float t = d / radius;
      info.r += strength * (1.0 - t * t);
    }
    gl_FragColor = info;
  }
`;

const RENDER_FRAG = `
  precision highp float;
  uniform sampler2D texture;
  uniform vec2 delta;
  varying vec2 coord;
  void main(){
    vec4 info = texture2D(texture, coord);
    vec2 dx = vec2(delta.x, 0.0);
    vec2 dy = vec2(0.0, delta.y);
    float dX = (texture2D(texture, coord + dx).r - texture2D(texture, coord - dx).r);
    float dY = (texture2D(texture, coord + dy).r - texture2D(texture, coord - dy).r);
    vec3 normal = normalize(vec3(dX * 60.0, dY * 60.0, 1.0));
    vec3 light   = normalize(vec3(-0.4, 0.6, 1.0));
    float diff   = max(0.0, dot(normal, light));
    float spec   = pow(max(0.0, dot(reflect(-light, normal), vec3(0.0,0.0,1.0))), 70.0);
    /* deep ocean base */
    vec3 shallow = vec3(0.03, 0.14, 0.26);
    vec3 deep    = vec3(0.00, 0.04, 0.10);
    float depth  = clamp(info.r * 3.0 + 0.5, 0.0, 1.0);
    vec3 color   = mix(deep, shallow, depth) * (0.5 + diff * 0.5);
    color       += vec3(0.85, 0.93, 1.0) * spec * 0.9;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src); gl.compileShader(sh);
  return sh;
}
function createProgram(gl, vert, frag) {
  const p = gl.createProgram();
  gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER,   vert));
  gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p); return p;
}
function createTexture(gl, w, h) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

function initWater(gl, w, h) {
  gl.getExtension("OES_texture_float");

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const textures = [createTexture(gl,w,h), createTexture(gl,w,h)];
  const fbos     = textures.map(t => {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    return fb;
  });

  const pUpdate = createProgram(gl, VERT_SRC, UPDATE_FRAG);
  const pDrop   = createProgram(gl, VERT_SRC, DROP_FRAG);
  const pRender = createProgram(gl, VERT_SRC, RENDER_FRAG);

  function bindQuad(prog) {
    const loc = gl.getAttribLocation(prog, "vertex");
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  let cur = 0;
  const delta = [1/w, 1/h];

  return {
    addDrop(nx, ny, r, strength) {          /* nx,ny in [0,1] */
      gl.useProgram(pDrop);
      bindQuad(pDrop);
      gl.uniform1i(gl.getUniformLocation(pDrop,"texture"), 0);
      gl.uniform2f(gl.getUniformLocation(pDrop,"center"),  nx, 1-ny);
      gl.uniform1f(gl.getUniformLocation(pDrop,"radius"),  r);
      gl.uniform1f(gl.getUniformLocation(pDrop,"strength"),strength);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[cur]);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1-cur]);
      gl.viewport(0,0,w,h);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      cur = 1-cur;
    },
    update() {
      gl.useProgram(pUpdate);
      bindQuad(pUpdate);
      gl.uniform1i(gl.getUniformLocation(pUpdate,"texture"), 0);
      gl.uniform2fv(gl.getUniformLocation(pUpdate,"delta"),  delta);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[cur]);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1-cur]);
      gl.viewport(0,0,w,h);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      cur = 1-cur;
    },
    render() {
      gl.useProgram(pRender);
      bindQuad(pRender);
      gl.uniform1i(gl.getUniformLocation(pRender,"texture"), 0);
      gl.uniform2fv(gl.getUniformLocation(pRender,"delta"),  delta);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[cur]);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0,0,w,h);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    },
  };
}

/* ═══════════════════════════════════════════════════
   Creature constants
   ═══════════════════════════════════════════════════ */
const CREATURE_OPTIONS = [
  { value:"reptile",   label:"Reptile"   },
  { value:"jellyfish", label:"Jellyfish" },
  { value:"squid",     label:"Squid"     },
  { value:"snake",     label:"Snake"     },
];

/* ═══════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════ */
export default function ReptileCreature() {
  const glCanvasRef  = useRef(null);   /* WebGL water */
  const c2dCanvasRef = useRef(null);   /* 2-D creature */
  const stateRef     = useRef({
    mouse: { x: window.innerWidth/2, y: window.innerHeight/2 },
    animId: null,
    water:  null,
  });
  const [creatureType, setCreatureType] = useState("jellyfish");

  /* ── build creature on 2-D canvas ── */
  const buildCreature = useCallback((canvas, ctx, type) => {
    const s = stateRef.current;
    if (s.animId) { cancelAnimationFrame(s.animId); s.animId = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width/2, cy = canvas.height/2;

    /* — shared helpers — */
    class Segment {
      constructor(parent, size, angle, range, stiffness) {
        this.isSegment = true; this.parent = parent;
        if (parent.children) parent.children.push(this);
        this.children=[]; this.size=size; this.relAngle=angle;
        this.defAngle=angle; this.absAngle=parent.absAngle+angle;
        this.range=range; this.stiffness=stiffness;
        this.updateRelative(false,true);
      }
      updateRelative(iter, flex){
        this.relAngle -= 2*Math.PI*Math.floor((this.relAngle-this.defAngle)/(2*Math.PI)+0.5);
        if(flex) this.relAngle=Math.min(this.defAngle+this.range/2,
          Math.max(this.defAngle-this.range/2,
            (this.relAngle-this.defAngle)/this.stiffness+this.defAngle));
        this.absAngle=this.parent.absAngle+this.relAngle;
        this.x=this.parent.x+Math.cos(this.absAngle)*this.size;
        this.y=this.parent.y+Math.sin(this.absAngle)*this.size;
        if(iter) this.children.forEach(c=>c.updateRelative(true,flex));
      }
      draw(iter){
        ctx.beginPath(); ctx.moveTo(this.parent.x,this.parent.y);
        ctx.lineTo(this.x,this.y); ctx.stroke();
        if(iter) this.children.forEach(c=>c.draw(true));
      }
      follow(iter){
        const px=this.parent.x,py=this.parent.y;
        const d=Math.hypot(this.x-px,this.y-py);
        this.x=px+this.size*(this.x-px)/d; this.y=py+this.size*(this.y-py)/d;
        this.absAngle=Math.atan2(this.y-py,this.x-px);
        this.relAngle=this.absAngle-this.parent.absAngle;
        this.updateRelative(false,true);
        if(iter) this.children.forEach(c=>c.follow(true));
      }
    }

    class LimbSystem {
      constructor(end,length,speed,creature){
        this.end=end; this.length=Math.max(1,length);
        this.creature=creature; this.speed=speed;
        creature.systems.push(this); this.nodes=[];
        let node=end;
        for(let i=0;i<length;i++){
          this.nodes.unshift(node); node=node.parent;
          if(!node.isSegment){this.length=i+1;break;}
        }
        this.hip=this.nodes[0].parent;
      }
      moveTo(x,y){
        this.nodes[0].updateRelative(true,true);
        const dist=Math.hypot(x-this.end.x,y-this.end.y);
        let len=Math.max(0,dist-this.speed);
        for(let i=this.nodes.length-1;i>=0;i--){
          const nd=this.nodes[i];
          const ang=Math.atan2(nd.y-y,nd.x-x);
          nd.x=x+len*Math.cos(ang); nd.y=y+len*Math.sin(ang);
          x=nd.x; y=nd.y; len=nd.size;
        }
        for(let i=0;i<this.nodes.length;i++){
          const nd=this.nodes[i];
          nd.absAngle=Math.atan2(nd.y-nd.parent.y,nd.x-nd.parent.x);
          nd.relAngle=nd.absAngle-nd.parent.absAngle;
          nd.children.forEach(ch=>{if(!this.nodes.includes(ch))ch.updateRelative(true,false);});
        }
      }
      update(){this.moveTo(s.mouse.x,s.mouse.y);}
    }

    class LegSystem extends LimbSystem {
      constructor(end,length,speed,creature){
        super(end,length,speed,creature);
        this.goalX=end.x; this.goalY=end.y; this.step=0; this.forwardness=0;
        this.reach=0.9*Math.hypot(this.end.x-this.hip.x,this.end.y-this.hip.y);
        let rel=this.creature.absAngle-Math.atan2(this.end.y-this.hip.y,this.end.x-this.hip.x);
        rel-=2*Math.PI*Math.floor(rel/(2*Math.PI)+0.5);
        this.swing=-rel+(2*(rel<0)-1)*Math.PI/2;
        this.swingOffset=this.creature.absAngle-this.hip.absAngle;
      }
      update(){
        this.moveTo(this.goalX,this.goalY);
        if(this.step===0){
          if(Math.hypot(this.end.x-this.goalX,this.end.y-this.goalY)>1){
            this.step=1;
            this.goalX=this.hip.x+this.reach*Math.cos(this.swing+this.hip.absAngle+this.swingOffset)+(2*Math.random()-1)*this.reach/2;
            this.goalY=this.hip.y+this.reach*Math.sin(this.swing+this.hip.absAngle+this.swingOffset)+(2*Math.random()-1)*this.reach/2;
          }
        } else {
          const theta=Math.atan2(this.end.y-this.hip.y,this.end.x-this.hip.x)-this.hip.absAngle;
          const dist=Math.hypot(this.end.x-this.hip.x,this.end.y-this.hip.y);
          const f2=dist*Math.cos(theta); const dF=this.forwardness-f2;
          this.forwardness=f2;
          if(dF*dF<1){this.step=0;this.goalX=this.hip.x+(this.end.x-this.hip.x);this.goalY=this.hip.y+(this.end.y-this.hip.y);}
        }
      }
    }

    class Creature {
      constructor(x,y,angle,fA,fF,fR,fT,rA,rF,rR,rT){
        this.x=x;this.y=y;this.absAngle=angle;
        this.fSpeed=0;this.fAccel=fA;this.fFric=fF;this.fRes=fR;this.fThresh=fT;
        this.rSpeed=0;this.rAccel=rA;this.rFric=rF;this.rRes=rR;this.rThresh=rT;
        this.children=[];this.systems=[];
      }
      follow(x,y){
        const dist=Math.hypot(this.x-x,this.y-y);
        const angle=Math.atan2(y-this.y,x-this.x);
        let accel=this.fAccel;
        if(this.systems.length>0) accel*=this.systems.filter(sy=>sy.step===0).length/this.systems.length;
        this.fSpeed+=accel*(dist>this.fThresh?1:0);
        this.fSpeed*=1-this.fRes;
        this.speed=Math.max(0,this.fSpeed-this.fFric);
        let dif=this.absAngle-angle;
        dif-=2*Math.PI*Math.floor(dif/(2*Math.PI)+0.5);
        if(Math.abs(dif)>this.rThresh&&dist>this.fThresh) this.rSpeed-=this.rAccel*(2*(dif>0)-1);
        this.rSpeed*=1-this.rRes;
        if(Math.abs(this.rSpeed)>this.rFric) this.rSpeed-=this.rFric*(2*(this.rSpeed>0)-1); else this.rSpeed=0;
        this.absAngle+=this.rSpeed;
        this.absAngle-=2*Math.PI*Math.floor(this.absAngle/(2*Math.PI)+0.5);
        this.x+=this.speed*Math.cos(this.absAngle);
        this.y+=this.speed*Math.sin(this.absAngle);
        this.absAngle+=Math.PI;
        this.children.forEach(c=>c.follow(true));
        this.systems.forEach(sy=>sy.update(x,y));
        this.absAngle-=Math.PI;
        this.draw(true);
      }
      draw(iter){
        const r=4;
        ctx.beginPath();
        ctx.arc(this.x,this.y,r,Math.PI/4+this.absAngle,7*Math.PI/4+this.absAngle);
        ctx.moveTo(this.x+r*Math.cos(7*Math.PI/4+this.absAngle),this.y+r*Math.sin(7*Math.PI/4+this.absAngle));
        ctx.lineTo(this.x+r*Math.cos(this.absAngle)*Math.SQRT2,this.y+r*Math.sin(this.absAngle)*Math.SQRT2);
        ctx.lineTo(this.x+r*Math.cos(Math.PI/4+this.absAngle),this.y+r*Math.sin(Math.PI/4+this.absAngle));
        ctx.stroke();
        if(iter) this.children.forEach(c=>c.draw(true));
      }
    }

    /* — Jellyfish — */
    class JellyfishCreature {
      constructor(x,y){
        this.x=x;this.y=y;this.absAngle=-Math.PI/2;
        this.vx=0;this.vy=0;this.phase=0;this.children=[];this.systems=[];
      }
      follow(x,y){
        const dx=x-this.x,dy=y-this.y,dist=Math.hypot(dx,dy);
        if(dist>20){this.vx+=(dx/dist)*0.22;this.vy+=(dy/dist)*0.22;}
        this.vx*=0.93;this.vy*=0.93;
        this.x+=this.vx;this.y+=this.vy;
        this.absAngle=Math.atan2(dy,dx);
        this.phase+=0.07;
        this.children.forEach(c=>c.follow(true));
        this.draw();
      }
      draw(){
        const pulse=1+0.13*Math.sin(this.phase);
        const r=30*pulse;
        /* glow */
        ctx.save();ctx.globalAlpha=0.10;
        ctx.beginPath();ctx.arc(this.x,this.y,r*1.7,0,Math.PI*2);
        ctx.fillStyle="#90e0ff";ctx.fill();ctx.restore();
        /* bell */
        ctx.beginPath();
        ctx.arc(this.x,this.y,r,Math.PI,0,false);
        ctx.closePath();ctx.stroke();
        /* ribs */
        ctx.save();ctx.globalAlpha=0.4;
        for(let i=-3;i<=3;i++){
          const ang=(i/3.5)*Math.PI*0.72;
          ctx.beginPath();
          ctx.moveTo(this.x,this.y);
          ctx.quadraticCurveTo(
            this.x+Math.sin(ang)*r*0.8,this.y-Math.cos(ang)*r*0.45,
            this.x+Math.sin(ang)*r,this.y
          );ctx.stroke();
        }ctx.restore();
        /* fringe */
        ctx.save();ctx.globalAlpha=0.5;
        for(let i=0;i<=9;i++){
          const ang=Math.PI+(i/9)*Math.PI;
          const wave=7*Math.sin(this.phase*1.4+i);
          ctx.beginPath();
          ctx.moveTo(this.x+r*Math.cos(ang),this.y+r*Math.sin(ang));
          ctx.lineTo(this.x+(r+14+wave)*Math.cos(ang),this.y+(r+14+wave)*Math.sin(ang));
          ctx.stroke();
        }ctx.restore();
        this.children.forEach(c=>c.draw(true));
      }
    }

    /* — Colour themes — */
    const themes = {
      reptile:   ["#70c8ff","#c890ff","#70ffd0"],
      jellyfish: ["#a0ecff","#d0b0ff","#a0ffe8"],
      squid:     ["#ff90e0","#c090ff","#ff90b0"],
      snake:     ["#ffd070","#ff9060","#ffb840"],
    };
    const [c0,c1,c2] = themes[type] || themes.reptile;
    const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    g.addColorStop(0,c0);g.addColorStop(0.5,c1);g.addColorStop(1,c2);
    ctx.strokeStyle=g; ctx.lineWidth=1.5;

    let critter;

    if(type==="jellyfish"){
      ctx.lineWidth=1.3;
      critter=new JellyfishCreature(cx,cy);
      for(let i=0;i<9;i++){
        const base=Math.PI+(Math.PI/(8))*i;
        let nd=new Segment(critter,26,base,0.55,2.5);
        for(let j=0;j<11;j++) nd=new Segment(nd,9,0,1.4,1.6);
      }
    } else if(type==="reptile"){
      const legNum=Math.floor(1+Math.random()*12);
      const sz=8/Math.sqrt(legNum);
      const tail=Math.floor(2+Math.random()*legNum*8);
      critter=new Creature(cx,cy,0,sz*10,sz*2,0.5,16,0.5,0.085,0.5,0.3);
      let spinal=critter;
      for(let i=0;i<6;i++){
        spinal=new Segment(spinal,sz*4,0,Math.PI*2/3,1.1);
        for(let ii=-1;ii<=1;ii+=2){let nd=new Segment(spinal,sz*3,ii,0.1,2);for(let iii=0;iii<3;iii++)nd=new Segment(nd,sz*0.1,-ii*0.1,0.1,2);}
      }
      for(let i=0;i<legNum;i++){
        if(i>0){for(let ii=0;ii<6;ii++){spinal=new Segment(spinal,sz*4,0,1.571,1.5);for(let iii=-1;iii<=1;iii+=2){let nd=new Segment(spinal,sz*3,iii*1.571,0.1,1.5);for(let iv=0;iv<3;iv++)nd=new Segment(nd,sz*3,-iii*0.3,0.1,2);}}}
        for(let ii=-1;ii<=1;ii+=2){
          let nd=new Segment(spinal,sz*12,ii*0.785,0,8);
          nd=new Segment(nd,sz*16,-ii*0.785,6.28,1);
          nd=new Segment(nd,sz*16,ii*1.571,Math.PI,2);
          for(let iii=0;iii<4;iii++) new Segment(nd,sz*4,(iii/3-0.5)*1.571,0.1,4);
          new LegSystem(nd,3,sz*12,critter);
        }
      }
      for(let i=0;i<tail;i++){spinal=new Segment(spinal,sz*4,0,Math.PI*2/3,1.1);for(let ii=-1;ii<=1;ii+=2){let nd=new Segment(spinal,sz*3,ii,0.1,2);for(let iii=0;iii<3;iii++)nd=new Segment(nd,sz*3*(tail-i)/tail,-ii*0.1,0.1,2);}}
    } else if(type==="snake"){
      ctx.lineWidth=2;
      critter=new Creature(cx,cy,0,12,1,0.5,16,0.5,0.085,0.5,0.3);
      let nd=critter;
      for(let i=0;i<128;i++) nd=new Segment(nd,8,0,Math.PI/2,1);
    } else if(type==="squid"){
      critter=new Creature(cx,cy,0,10,3,0.5,16,0.5,0.085,0.5,0.3);
      const legs=6,joints=32;
      for(let i=0;i<legs;i++){
        let nd=critter;
        const a=(Math.PI/2)*(i/(legs-1)-0.5);
        for(let ii=0;ii<joints;ii++) nd=new Segment(nd,64/joints,a*(ii===0?1:0),Math.PI,1.2);
        new LegSystem(nd,joints,30,critter);
      }
    }

    /* — rAF loop — */
    function loop(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if(type==="jellyfish") critter.follow(s.mouse.x,s.mouse.y);
      else critter.follow(s.mouse.x,s.mouse.y);
      s.animId=requestAnimationFrame(loop);
    }
    s.animId=requestAnimationFrame(loop);
  },[]);

  /* ── WebGL water loop ── */
  useEffect(()=>{
    const glCanvas  = glCanvasRef.current;
    const c2dCanvas = c2dCanvasRef.current;
    if(!glCanvas||!c2dCanvas) return;

    const W=window.innerWidth, H=window.innerHeight;
    glCanvas.width=W; glCanvas.height=H;
    c2dCanvas.width=W; c2dCanvas.height=H;

    const gl=glCanvas.getContext("webgl",{preserveDrawingBuffer:false});
    const ctx=c2dCanvas.getContext("2d");
    const s=stateRef.current;

    const water=initWater(gl,W,H);
    s.water=water;

    let rafW;
    function waterLoop(){
      water.update();
      water.render();
      rafW=requestAnimationFrame(waterLoop);
    }
    rafW=requestAnimationFrame(waterLoop);

    buildCreature(c2dCanvas,ctx,creatureType);

    const onMove=e=>{
      const x=e.clientX??e.touches?.[0]?.clientX??s.mouse.x;
      const y=e.clientY??e.touches?.[0]?.clientY??s.mouse.y;
      s.mouse.x=x; s.mouse.y=y;
      water.addDrop(x/W, y/H, 0.03, 0.06);
    };

    window.addEventListener("mousemove",onMove);
    window.addEventListener("touchmove",onMove,{passive:true});

    return ()=>{
      cancelAnimationFrame(rafW);
      if(s.animId) cancelAnimationFrame(s.animId);
      window.removeEventListener("mousemove",onMove);
      window.removeEventListener("touchmove",onMove);
    };
  },[creatureType,buildCreature]);

  return (
    <div style={{position:"relative",width:"100vw",height:"100vh",overflow:"hidden",cursor:"none",background:"#000a18"}}>
      {/* WebGL water (background) */}
      <canvas ref={glCanvasRef}
        style={{position:"absolute",inset:0,display:"block",zIndex:1}}/>
      {/* 2-D creature (foreground, transparent bg) */}
      <canvas ref={c2dCanvasRef}
        style={{position:"absolute",inset:0,display:"block",zIndex:2,pointerEvents:"none"}}/>

      {/* UI */}
      <div style={{position:"absolute",top:20,left:20,zIndex:10}}>
        <p style={{fontFamily:"'Courier New',monospace",fontSize:9,letterSpacing:"0.25em",
                   color:"rgba(140,210,255,0.45)",textTransform:"uppercase",margin:"0 0 8px"}}>
          Creature
        </p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {CREATURE_OPTIONS.map(opt=>(
            <button key={opt.value} onClick={()=>setCreatureType(opt.value)}
              style={{
                fontFamily:"'Courier New',monospace",fontSize:11,letterSpacing:"0.12em",
                textTransform:"uppercase",padding:"5px 12px",
                border: creatureType===opt.value?"1px solid rgba(120,200,255,0.9)":"1px solid rgba(120,200,255,0.18)",
                borderRadius:3,
                background: creatureType===opt.value?"rgba(80,160,255,0.15)":"rgba(0,10,30,0.55)",
                color: creatureType===opt.value?"rgba(160,230,255,1)":"rgba(120,180,220,0.5)",
                cursor:"pointer",transition:"all 0.2s",backdropFilter:"blur(4px)",
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p style={{position:"absolute",bottom:18,right:20,zIndex:10,margin:0,
                 fontFamily:"'Courier New',monospace",fontSize:9,letterSpacing:"0.15em",
                 color:"rgba(100,180,220,0.22)",textTransform:"uppercase"}}>
        Move cursor to ripple
      </p>
    </div>
  );
}
