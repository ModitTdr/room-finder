import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import userService from "../services/userService.js";

dotenv.config();

const isLoggedIn = async (req, res, next) => {
    let token;
    let authHeaders = req.headers.Authorization || req.headers.authorization;

    if (authHeaders && authHeaders.startsWith("Bearer")) {
        token = authHeaders.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(404).json({ message: "No token! Authorization Denied" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserByIdService(decode.id);
        if (!user) {
            return res.status(401).json({
                error: 'Authentication failed',
                code: 'USER_NOT_FOUND'
            });
        }
        req.user = decode;
        next();
    } catch (error) {
        res.status(500).json({ message: "Token is not valid" });
    }
};

export default isLoggedIn;