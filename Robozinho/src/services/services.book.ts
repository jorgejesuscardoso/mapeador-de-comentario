import BookModel from "../model/model.book";


class BookServices {    
  private model: BookModel;

  constructor(model: BookModel) {
    this.model = model;
  }

    async CreateBook(memberId: number, title: string, wUrl: string) {
        try {
            
            const newBook = await this.model.createBook(memberId, title, wUrl);
            return newBook;
        } catch (error) {
            console.error("❌ Erro ao criar o livro:", error);
        }
    }
    
    async GetBooks() {
        try {
            const books = await this.model.getBooks();
            return books;
        } catch (error) {
            console.error("❌ Erro ao buscar os livros:", error);
        }
    }

    async GetBookById(bookId: number) {
        try {
            const book = await this.model.getBookById(bookId);
            return book;
        } catch (error) {
            console.error("❌ Erro ao buscar o livro:", error);
        }
    }

    async UpdateBook(bookId: number, title?: string, wUrl?: string, memberId?: number) {
        try {            
            const updatedBook = await this.model.updateBook(bookId, title, wUrl, memberId);
            return updatedBook;
        } catch (error) {
        console.error("❌ Erro ao atualizar o livro:", error);
        }
    }
    
    async DeleteBook(bookId: number) {
        try {
            const deletedBook = await this.model.deleteBook(bookId);
            return deletedBook;
        } catch (error) {
            console.error("❌ Erro ao deletar o livro:", error);
        }
    }
}

export default BookServices;