import { PrismaClient } from "@prisma/client";

class UsersModel {
    private prisma: PrismaClient;
  constructor( prisma: PrismaClient) {
    this.prisma = prisma;
  }

   // Buscar usuários com livros e subs
   async getUsers() {
    try {
        const users = await this.prisma.user.findMany({
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

// Buscar admins com livros e subs
async getAdms() {
    try {
        const admins = await this.prisma.adm.findMany({
            include: {
                books: true,  // Carrega os livros do administrador
                subs: {
                    include: {
                        sub: true  // Carrega os detalhes das subs
                    }
                }
            }
        });
        
        return admins;
    } catch (error) {
        console.log(error);
        return error;
    }
}
}

export default UsersModel;