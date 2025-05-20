import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

import authRoutes from "./routes/authRoute.js"

const app = express()
app.use(cors())

app.use(express.json())


dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(()=>{
    console.log("Successfully connected to db")
    app.listen(PORT,()=>{
        console.log(`Server is running on pt ${PORT}`)
    })

}).catch((error)=>{
    console.log(error)
});


app.use('/api/auth', authRoutes);

