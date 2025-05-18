import mongoose from "mongoose";    

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://VishalMohan:Root123@cluster0.v2mrldf.mongodb.net/food-dly').then(()=>console.log("MongoDB connected successfully"))
}