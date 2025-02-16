import { PrismaClient } from "@prisma/client";

class UsersModel {
    private prisma: PrismaClient;
  constructor( prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(data: any) {
    try {

        const user = await this.prisma.member.create({
            data: {
                name: data.name,
                user: data.user,
                age: data.age,
                password: data.password,
                userWtp: data.userWtp,
                phone: data.phone,
                role: data.role,
                points: data.points,
                subs: data.subs,
                books: {
                    create: data.books.map((book: { title: string, wUrl: string }) => ({
                        title: book.title,
                        wUrl: book.wUrl,
                    })),
                },
            },
            include: {
                books: true, // Para incluir os livros criados na resposta
            },
        });

        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
}
   // Buscar usuários com livros e subs
   async getUsers() {
    try {
        const users = await this.prisma.member.findMany({
            include: {
                books: true,
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
            console.log(data);
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