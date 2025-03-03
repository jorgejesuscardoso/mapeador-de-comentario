import { PrismaClient } from "@prisma/client";
import Jwt from "./jwt";

class Auth {
    prisma: PrismaClient;
    jwt: Jwt
    secret: string
    expiresIn: number
  
    constructor() {
        this.secret = process.env.SECRET_JWT || 'secret';
        this.expiresIn = process.env.EXPIRES_IN ? parseInt(process.env.EXPIRES_IN) : 86400; 
        this.prisma = new PrismaClient();
        this.jwt = new Jwt(
            this.secret,
            this.expiresIn
        );
  }

    async auth(user: string, password: string) {
       try {
            const exist = await this.prisma.member.findFirst({
                where: {
                    user
                },
            });

            if (!exist) {
            return { error: "Usuário não encontrado!" };
            }
            if (exist.password !== password) {
            return { error: "Dados Inválidos!" };
            }

            const token = this.jwt.sign({ id: exist.id });

            const data = {
                user: {
                    id: exist.id,
                    user: exist.user,
                    name: exist.name,
                    role: exist.role,
                    userWtp: exist.userWtp,
                    age: exist.age,
                    phone: exist.phone,
                    points: exist.points,
                    subRole: exist.subRole,
                },
                token,
            };

            return data;
       } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return {error: "Error to get all users"};	
       }
    }

    
}

export default Auth;