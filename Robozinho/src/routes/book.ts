import express, { Router } from "express";
import BookController from "../controler/Controller.book";
import BookServices from "../services/services.book";
import { PrismaClient } from "@prisma/client";
import BookModel from "../model/model.book";


const prisma = new PrismaClient();
const model = new BookModel(prisma);
const service = new BookServices(model);


const Book = Router();
const controller = new BookController(service);

Book.post('/book', async (req: express.Request, res: express.Response) => {
    const { memberId, title, wUrl } = req.body.book;
    const newBook = await controller.CreateBook(memberId, title, wUrl);
    res.json(newBook);
});

Book.get('/books', async (req: express.Request, res: express.Response) => {
    console.log("Rotas de livros");    
    const books = await controller.GetBooks();
    res.json(books);
});

Book.get('/book/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const book = await controller.GetBookById(+id);
    res.json(book);
});

Book.put('/book/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedBook = await controller.UpdateBook(+id, updates);
    res.json(updatedBook);
});

Book.delete('/book/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const deletedBook = await controller.DeleteBook(+id);
    res.json(deletedBook);
});


export default Book;