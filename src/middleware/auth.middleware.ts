import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";

dotenv.config();

const authorization = async(req: Request, res: Response, next: NextFunction):Promise<void> =>{
    try {
        const cookiename = 'jwtToken';

        const cookie = req.cookies?.[cookiename];
        const authHeader = req.headers?.authorization;

        const accessToken = cookie || (authHeader && authHeader.startsWith('Bearer') ? authHeader.split('')[1]: null)

        if(!accessToken){
            res.status(400).json({
                success: false,
                message: "Unauthorized, no access token."
            })
            return;
        }

        const jwtUser = jwt.verify(accessToken, process.env.SECRET_KEY) as {id: string, email: string};

        if(!jwtUser || !jwtUser.id){
            res.status(401).json({
                success:false,
                message: "Unauthorized. Invalid token payload."
            })
            return;
        }

        (req as any).user = {id: jwtUser.id};
        next();



    } catch (error) {
        console.error("Error caused by ", error);
        if(error.name === "JsonWebTokenError"){
            res.status(401).json({
                success:false,
                message: "Unauthorized. Token is invalid."
            })
            return;
        }
      
        if(error.name === "TokenExpiredError"){
            res.status(401).json({
                success:false,
                message: "Unauthorized. Token is expired."
            })
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error during authorization"
        })
        return;
    }

}

export default authorization;