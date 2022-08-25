const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')
connectToMongo()

const app = express()
const port = 4000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/notes', require('./routes/notes'))
app.use('/api/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

