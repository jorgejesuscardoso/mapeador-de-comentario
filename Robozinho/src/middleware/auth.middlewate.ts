import Jwt from "../auth/jwt";
import { Request, Response, NextFunction } from "express";

class AuthMiddleware {
    private jwt: Jwt;

    constructor(jwt: Jwt) {
        this.jwt = jwt;
    }

    public verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers['authorization'] as string;
        
        if (!token) {
            res.status(401).json({ message: 'Token not provided' });
            return;
            
        }

        console.log(token);

        const tokenValue = token.split(' ')[1];
        
        if (!tokenValue) {
            res.status(401).json({ message: 'Token format invalid' });
            return;
        }

        try {
            const decoded = this.jwt.verify(tokenValue);
            console.log(decoded);
            req.body.decoded = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token invalid' });
            return;
        }
    };
}

export default AuthMiddleware;
