import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const isLoggedIn = (req,res,next) => {
    let token;
    let authHeaders = req.headers.Authorization || req.headers.authorization;

    if(authHeaders && authHeaders.startsWith("Bearer")){
        token = authHeaders.split(" ")[1];
    }
    else if(req.cookies && req.cookies.token){
        token = req.cookie.token;
    }

    if(!token){
        return res.status(404).json({message: "No token! Authorization Denied"});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(error){
        res.status(500).json({message: "Token is not valid"});
    }
};

export default isLoggedIn;