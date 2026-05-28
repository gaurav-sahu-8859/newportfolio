require("dotenv").config()
let express = require("express");
let cors = require("cors")
let app = express();
const connectDb = require("./config/db.js");

var corsOptions = {
  origin: ['http://localhost:5173',],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,        //cookies/auth allow karta hai
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/", require('./routes/auth-router.js'))

connectDb().then(() => {
  app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  }).on("error", (err) => {
    // console.log(err.message);
    console.log(err);
  })
}).catch((e) => {
  console.log(e);
})


















// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const url = require("url");
// function setcors(res) {
//     // Add CORS headers
//     res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
// }

// const server = http.createServer((req, res) => {
//     setcors(res);
//     if (req.method === "OPTIONS") {
//         // Respond to preflight request
//         res.writeHead(200);
//         res.end();
//         return;
//     }
//     if (req.method === "POST" && req.url === "/upload") {
//         let body = "";
//         // let body = [];
//         req.on("data", chunk => {
//             body += chunk.toString();
//             // body.push(chunk.toString())
//         });
//         req.on("end", () => {
//             const data = JSON.parse(body); // Parse JSON
//             console.log("Form Data:", data);
//             res.writeHead(200, { "Content-Type": "text/plain" });
//             res.end(`Thank you, ${data.name}!`);
//         });
//     }
//     // else if (req.method === "GET" && req.url === "/view") {
//     //     res.writeHead(200, { "Content-Type": "application/json" });
//     //     let data = readData()
//     //     console.log(data);
//     //     res.write(JSON.stringify(data))
//     //     res.end()
//     // }
//     else {
//         res.writeHead(200, { "Content-Type": "text/plain" });
//         res.end("Node.js Backend Running");
//     }
// });
// server.listen(3000, () => console.log("Server running on http://localhost:3000"));
