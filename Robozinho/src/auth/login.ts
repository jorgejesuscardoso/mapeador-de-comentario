import { PrismaClient } from "@prisma/client";

class Auth {
    prisma: PrismaClient;
  
    constructor() {
        this.prisma = new PrismaClient();
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
                    subRole: exist.subRole,
                },
            };
       } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return {error: "Error to get all users"};	
       }
    }

    
}

export default Auth;