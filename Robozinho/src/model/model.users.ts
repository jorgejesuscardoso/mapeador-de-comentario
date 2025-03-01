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
                isDeleted: false,
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

    // Buscar usuário por ID
    async getUserById(id: number) {
        try {
            const user = await this.prisma.member.findUnique({
                where: {
                    id
                },
                include: {
                    books: true,
                }
            });

            return user;
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

    // Pesquisar usuário por nome ou user (case insensitive) que tenha partes do texto
    async searchUser(search: string, take: number = 10, page: number = 1) {
        const skip = (page - 1) * take; // Define quantos itens pular
    
        try {
            const searchTerm = String(search || ''); 
        
            // Contar o total de registros que correspondem ao filtro
            const totalUsers = await this.prisma.member.count({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive"
                            }
                        },
                        {
                            user: {
                                contains: searchTerm,
                                mode: "insensitive"
                            }
                        },
                        {
                            userWtp: {
                                contains: searchTerm,
                                mode: "insensitive"
                            }
                        }
                    ]
                }
            });
        
            // Calcular o total de páginas (arredondando para cima)
            const totalPages = Math.ceil(totalUsers / take);
        
            const skip = (page - 1) * take;
            const users = await this.prisma.member.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive"
                            }
                        },
                        {
                            user: {
                                contains: searchTerm,
                                mode: "insensitive"
                            }
                        },
                        {
                            userWtp: {
                                contains: searchTerm,
                                mode: "insensitive"
                            }
                        }
                    ]
                },
                take: take,
                skip: skip
            });
        
            return {
                users,
                totalPages // Retorne o total de páginas para usar no front-end
            };
        } catch (error) {
            console.log(error);
            return error;
        }        
    }
    
    

    // Deletar usuário (soft delete)
    async deleteUser(id: number) {
        try {
            const user = await this.prisma.member.update({
                where: {
                    id
                },
                data: {
                    isDeleted: true
                }
            });
            
            if (!user) {
                return "Usuário não encontrado.";
            }

            const msg = `Usuário marcado como deletado as ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;

            const dataFormatted = {
                id: user.id,
                name: user.name,
                user: user.user,
                isDeleted: user.isDeleted,
            };
            return { msg, data: dataFormatted };
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}



export default UsersModel;