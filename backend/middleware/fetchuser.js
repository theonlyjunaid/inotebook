const jwt = require('jsonwebtoken');
const JWT_SECRET = "Junaidisa$oogboy"

const fetchuser = (req, res, next) => {
    // get the user from the jwt token and id to request id
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).json({ error: "please authenticate with a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).json({ error: "please authenticate with a valid token" })

    }

}

module.exports = fetchuser