// application to  create and decode JSon web Tokens
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";

const result = dotenv.config();

// Create the Token
export function createToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
    };
    const options = {
        algorithm: "HS256",
        expiresIn: "1h",
    };
    return jwt.sign(payload, process.env.cookie_password, options);
}

// Decode the Token
export function decodeToken(token) {
    const userInfo = {};
    try {
        const decoded = jwt.verify(token, process.env.cookie_password);
        userInfo.userId = decoded.id;
        userInfo.email = decoded.email;
    } catch (e) {
        console.log(e.message);
    }
    return userInfo;
}

// Validate the token
export async function validate(decoded, request) {
    const user = await db.userStore.getUserById(decoded.id);
    if (!user) {
        return { isValid: false };
    }
    return { isValid: true, credentials: user };
}

