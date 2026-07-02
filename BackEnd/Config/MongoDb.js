import mongoose from "mongoose";

const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            writeConcern: { w: "majority" } // ✅ Ensures safe writes
        });

        console.log("✅ Database Connected");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1); // Exit process if connection fails
    }
};

export default ConnectDb;
