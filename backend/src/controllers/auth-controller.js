const User = require("../models/user_model")
const bcrypt = require('bcrypt')
const home = async (req, res) => {
    try {
        res
            .status(200)
            .send("welcome to profile controller");
    } catch (error) {
        console.log(error)
    }
}
const register = async (req, res) => {
    try {
        console.log(req.body)
        const { username, email, phone, password } = req.body;

        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ msg: "email already exists" })
        }
        //hash the password
        const saltRound = 10;
        const hash_password = await bcrypt.hash(password, saltRound)
        const userCreated = await User.create({ username, email, phone, password: hash_password })
        res
            .status(201).json({
                msg: "registration successful",
                // msg: userCreated,
                token: await userCreated.generateToken(),
                userId: userCreated._id.toString(),
            });
        // .send({ messege: req.body });
        // .send({messege:"welcome to register using controller"});
    } catch (error) {
        next(error)
        // res.status(500).json("internal server error")
        // console.log(error + "can't find file")
    }
}


//user login logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            return res.status(400).json({ message: "invalid credentials" })
        }
        // const user = await bcrypt.compare(password, userExist.password);
        const user = await userExist.comparePassword(password)
        if (user) {
            res.status(200).json({
                msg: "login successful",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            });
        }
        else {
            res.status(401).json({ message: "invalid email or password" })
        }
    } catch (error) {
        res.status(500).json("internal server error");
    }
}
module.exports = { home, register, login };