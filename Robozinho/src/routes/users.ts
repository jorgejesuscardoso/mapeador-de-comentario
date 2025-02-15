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

User.get("/users", async (req, res) => {
  const users = await controller.getUsers();
  res.json(users);
});

User.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await controller.updateUser(Number(id), data);
  res.json(user);
});

User.get("/aaa/id", async (req, res) => {
  res.json({ message: "Hello World" });
});

export default User;