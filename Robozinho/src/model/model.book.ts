import { PrismaClient } from "@prisma/client";

class BookModel {
    private prisma: PrismaClient;
  constructor( prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createBook(memberId: number, title: string, wUrl: string) {
    try {
        const newBook = await this.prisma.book.create({
            data: {
                title,
                wUrl,
                memberId, // Relaciona o livro ao membro existente
            },
        });

        return newBook;
    } catch (error) {
        console.error("❌ Erro ao criar o livro:", error);
    }};

    async getBooks() {
        try {
            const books = await this.prisma.book.findMany({
                include: { member: true }, // Inclui o membro relacionado
            });
    
            return books;
        } catch (error) {
            console.error("❌ Erro ao buscar os livros:", error);
        }
    }

    async getBookById(bookId: number) {
        try {
            const book = await this.prisma.book.findUnique({
                where: { id: bookId },
                include: { member: true }, // Inclui o membro relacionado
            });
    
            return book;
        } catch (error) {
            console.error("❌ Erro ao buscar o livro:", error);
        }
    }

    async updateBook(bookId: number, title?: string, wUrl?: string, memberId?: number ) {
        try {
            
            const updatedBook = await this.prisma.book.update({
                where: { id: bookId },
                data: {
                    title,
                    wUrl,
                    memberId,
                }
            });    
            
            if (!updatedBook) {
                throw new Error("Livro não encontrado!");
            }

            return updatedBook;
        } catch (error) {
            console.error("❌ Erro ao atualizar o livro:", error);
        }
    } 
    
    async deleteBook(bookId: number) {
        try {
            const deletedBook = await this.prisma.book.delete({
                where: { id: bookId },
            });
    
            return deletedBook;
        } catch (error) {
            console.error("❌ Erro ao deletar o livro:", error);
        }
    }
}

export default BookModel;