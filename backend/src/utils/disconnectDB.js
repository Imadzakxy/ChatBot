import mongoose from "mongoose"


const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
    } catch (error) {
        process.exit(1);
    }
}

export default disconnectDB