import express, { Router } from "express";
import UsersController from "../controler/Controler.users";
import UsersServices from "../services/services.users";
import { PrismaClient } from "@prisma/client";
import UsersModel from "../model/model.users";


const prisma = new PrismaClient();
const model = new UsersModel(prisma);
const service = new UsersServices(model);


const User = Router();
const controller = new UsersController(service);

User.post("/create/users", async (req, res) => {
  const data = req.body;
  const user = await controller.createUser(data);
  res.json(user);
});

User.get("/users", async (req, res) => {
  const { take, page } = req.query;
  const takeNumber = take !== undefined && +take > 0 ? +take : 10;
  const pageNumber = page !== undefined && +page > 0 ? +page : 1;
  const users = await controller.getUsers(takeNumber, pageNumber);
  res.json(users);
});

User.get("/users/all", async (req, res) => {
  const users = await controller.getAllUsers();
  res.json(users);
});

User.get("/users/deleted", async (req, res) => {
  const { take, page } = req.query;
  const takeNumber = take !== undefined && +take > 0 ? +take : 10;
  const pageNumber = page !== undefined && +page > 0 ? +page : 1;
  const users = await controller.getDeletedUsers(takeNumber, pageNumber);
  res.json(users);
});

User.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await controller.getUserById(Number(id));
  res.json(user);
});

User.get("/search/users", async (req, res) => {
  const data = req.query;
  const user = await controller.searchUser(data);
  res.json(user);
});

User.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await controller.updateUser(Number(id), data);
  res.json(user);
});

User.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await controller.deleteUser(Number(id));
  res.json(user);
});

export default User;