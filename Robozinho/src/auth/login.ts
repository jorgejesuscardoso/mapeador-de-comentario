import { PrismaClient } from "@prisma/client";

class Auth {
    prisma: PrismaClient;
  
    constructor() {
        this.prisma = new PrismaClient();
  }
    async getAllAdm() {
        try {
            return await this.prisma.adm.findMany();
        } catch (error) {
            throw new Error("Error to get all users");
        }

    }

    async auth(user: string, password: string) {
       try {
            const exist = await this.prisma.adm.findFirst({
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
        
            return {
                user: {
                    id: exist.id,
                    user: exist.user,
                    name: exist.name,
                    role: exist.role,
                    userWtp: exist.userWtp,
                    age: exist.age,
                    phone: exist.phone,
                    points: exist.points,
                },
            };
       } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return {error: "Error to get all users"};	
       }
    }

    
}

export default Auth;