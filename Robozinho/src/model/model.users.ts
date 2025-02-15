import { PrismaClient } from "@prisma/client";

class UsersModel {
    private prisma: PrismaClient;
  constructor( prisma: PrismaClient) {
    this.prisma = prisma;
  }

   // Buscar usuários com livros e subs
   async getUsers() {
    try {
        const users = await this.prisma.member.findMany({
            include: {
                books: true,  // Carrega os livros do usuário
                subs: {
                    include: {
                        sub: true  // Carrega os detalhes das subs
                    }
                }
            }
        });

        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
}
    // Atualizar usuário

    async updateUser(id: number, data: any) {
        try {
            
            const user = await this.prisma.member.update({
                where: {
                    id
                },
                data
            });
            
            return user;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

export default UsersModel;