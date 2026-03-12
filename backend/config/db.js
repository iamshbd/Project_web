import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://seanghaijim2006_db_user:quizzweb123@cluster0.tgxootc.mongodb.net/?appName=Cluster0')
    .then(() => {console.log('DB CONNECTED ')})
};