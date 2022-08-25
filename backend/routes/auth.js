const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = "Junaidisa$oogboy"
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
let success = false;
//ROUTE-1:Create a User using: POST "/api/auth/createuser",Does not requie auth
router.post('/createuser', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password atleast must be 5 charater').isLength({ min: 5 }),
], async (req, res) => {
    //i there are error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    //cehck whether the user with the same email exist already
    try {
        let user = await User.findOne({ email: req.body.email });
        console.log(user)
        if (user) {
            return res.status(400).json({ success, message: "sorry user already exist with this email" })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const jwnData = jwt.sign(data, JWT_SECRET)
        // console.log(jwnData)
        res.json({ jwnData })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE -2: authenticate a user using post "/api/auth/login" no login required
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res) => {
    //i there are error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ error: "please try to login with correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            res.status(400).json({ error: "please try to login with correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const jwnData = jwt.sign(data, JWT_SECRET)
        success = true
        console.log(success + " " + jwnData)
        res.json({ success, jwnData })
    } catch (error) {
        console.error(error.message)
        res.status(500).send(success, "Internal server error")
    }

})
//ROUTE -3: get logged in user detail POST "/api/auth/getuser" login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

module.exports = router