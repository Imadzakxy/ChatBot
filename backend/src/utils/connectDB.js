import mongoose from "mongoose"



const connectDB = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI); 
    } catch (error) {
        console.log(error.message);
        process.exit(1) 
    }
}


export default connectDB