let express = require("express")
let userSchema = require(".../userschema")
const { default: mongoose } = require("mongoose")
router = express.Router()
router.get("/", (req, res) => {
    res.send("helo")
})
router.get("/about", (req, res) => {
    res.send("about")
})
router.get("/services", (req, res) => {
    res.send("services")
})
router.post("/signup", async (req, res) => {
    let user = mongoose.model("user", userSchema)
    let newuser = await user.create(req.body)
    console.log(newuser);
    res.send({
        msg: "data recieved successfully!",
        data: req.body
    })
    // res.send("Contact name: " + req.body.name+" email "+req.body.email+" address "+req.body.address+" password "+req.body.password+" phone "+req.body.phone);
});

router.get("/service", (req, res) => {
    res.send("resname url wala is : " + req.query.name)
})
router.get("/:u1", (req, res) => {
    res.send("resname is param is  : " + req.params.u1)
})
module.exports = router 