require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const userRouter = require('./routes/userRouter')

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

app.use('/user',userRouter)

// Connect to mongodb
//const URI = process.env.MONGODB_URL
// mongoose.connect(URI, {
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, err => {
//     if(err) throw err;
//     console.log("Connected to mongodb")
// })
mongoose.connect('mongodb://localhost/myTable').then(() => console.log("conected to mongodb...")).catch(err => console.log("could not connect to mongDB...", err));
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})