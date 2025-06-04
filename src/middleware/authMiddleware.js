import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const verifyToken = (req,res,next) => {
    let token;
    let authHeaders = req.headers.Authorization || req.headers.authorization;

    if(authHeaders && authHeaders.startsWith("Bearer")){
        token = authHeaders.split(" ")[1];

        if(!token){
            return res.status(404).json({message: "No token! Authorization Denied"});
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            console.log("The decoded user is:", req.user);
            next();
        }catch(error){
            res.status(500).json({message: "Token is not valid"});
        }
    }else{
        return res.status(404).json({message: "No token! Authorization Denied"});
    }
};

export default verifyToken;