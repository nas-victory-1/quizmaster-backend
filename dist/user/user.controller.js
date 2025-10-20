"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // console.log(hashedPassword);
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        // console.log(newUser);
        const { password: _, ...newUserWithoutPassword } = newUser.toObject();
        // console.log(newUserWithoutPassword);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUserWithoutPassword,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        return;
    }
};
exports.signUp = signUp;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (!existingUser) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const correctPassword = await bcrypt_1.default.compare(password, existingUser.password);
        if (!correctPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        if (!process.env.SECRET_KEY) {
            res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
            return;
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.SECRET_KEY, { expiresIn: "1d" });
        const { password: _, ...userWithoutPassword } = existingUser.toObject();
        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // Send token in response body (frontend stores in localStorage)
            data: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
//# sourceMappingURL=user.controller.js.map