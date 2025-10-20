"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        await mongoose_1.default.connect(mongoUri);
        console.log("✅ Connected to db");
        // Connection event handlers
        mongoose_1.default.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });
        process.on("SIGINT", async () => {
            await mongoose_1.default.connection.close();
            console.log("MongoDB connection closed due to app termination");
            process.exit(0);
        });
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
exports.connectToDb = connectToDb;
//# sourceMappingURL=mongodb.js.map