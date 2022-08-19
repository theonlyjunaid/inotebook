const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = "Junaidisa$oogboy"
const jwt = require('jsonwebtoken');
//Create a User using: POST "/api/auth/createuser",Does not requie auth
router.post('/createuser', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password atleast must be 5 charater').isLength({ min: 5 }),
], async (req, res) => {
    //i there are error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //cehck whether the user with the same email exist already
    try {
        let user = await User.findOne({ email: req.body.email });
        console.log(user)
        if (user) {
            return res.status(400).json({ message: "sorry user already exist with this email" })
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
        res.status(500).send("some error ocured")
    }
})
module.exports = router