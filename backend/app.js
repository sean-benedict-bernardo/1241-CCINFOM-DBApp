const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())

// Onconnect
app.get('/', (req, res) => {
    const obj = { status: 200, text: 'Hello World!' }
    res.send(obj)
})



// Server loop basically
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})