import BookServices from "../services/services.book";


class BookController {
    private service: BookServices;

  constructor(service: BookServices) {
    this.service = service
  }

    async CreateBook(memberId: number, title: string, wUrl: string) {
        try {
        const newBook = await this.service.CreateBook(memberId, title, wUrl);
        return newBook;
        } catch (error) {
        console.error("❌ Erro ao criar o livro:", error);
        }
    } 

    async GetBooks() {
        try {
        const books = await this.service.GetBooks();
        return books;
        } catch (error) {
        console.error("❌ Erro ao buscar os livros:", error);
        }
    }

    async GetBookById(bookId: number) {
        try {
        const book = await this.service.GetBookById(bookId);
        return book;
        } catch (error) {
        console.error("❌ Erro ao buscar o livro:", error);
        }
    }

    async UpdateBook(bookId: number, updates: any) {
        try {
            const { title, wUrl, memberId } = updates.update;
            const updatedBook = await this.service.UpdateBook(bookId, title, wUrl, +memberId);
            return updatedBook;
        } catch (error) {
        console.error("❌ Erro ao atualizar o livro:", error);
        }
    }

    async DeleteBook(bookId: number) {
        try {
        const deletedBook = await this.service.DeleteBook(bookId);
        return deletedBook;
        } catch (error) {
        console.error("❌ Erro ao deletar o livro:", error);
        }
    }

}

export default BookController;