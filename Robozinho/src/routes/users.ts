import express, { Router } from "express";
import UsersController from "../controler/Controler.users";
import UsersServices from "../services/services.users";
import { PrismaClient } from "@prisma/client";
import UsersModel from "../model/model.users";
import AuthMiddleware from "../middleware/auth.middlewate";
import Jwt from "../auth/jwt";
import Bcrypt from "../auth/bcrypt";

const secret = process.env.SECRET_JWT as string;
const expiresIn = process.env.EXPIRES_IN_JWT ? Number(process.env.EXPIRES_IN_JWT) : 86400;

const prisma = new PrismaClient();
const model = new UsersModel(prisma);
const bcrypt = new Bcrypt();
const service = new UsersServices(model, bcrypt);
const jwt = new Jwt(secret, expiresIn);
const authMiddleware = new AuthMiddleware(jwt);


const User = Router();
const controller = new UsersController(service);

User.post("/create/users", authMiddleware.verifyToken, async (req, res) => {
  const data = req.body;
  const user = await controller.createUser(data);
  res.json(user);
});

User.get("/users", authMiddleware.verifyToken, async (req, res) => {
  const { take, page } = req.query;
  const takeNumber = take !== undefined && +take > 0 ? +take : 10;
  const pageNumber = page !== undefined && +page > 0 ? +page : 1;
  const users = await controller.getUsers(takeNumber, pageNumber);
  res.json(users);
});

User.get("/users/all", authMiddleware.verifyToken, async (req, res) => {
  const users = await controller.getAllUsers();
  res.json(users);
});

User.get("/users/deleted", authMiddleware.verifyToken, async (req, res) => {
  const { take, page } = req.query;
  const takeNumber = take !== undefined && +take > 0 ? +take : 10;
  const pageNumber = page !== undefined && +page > 0 ? +page : 1;
  const users = await controller.getDeletedUsers(takeNumber, pageNumber);
  res.json(users);
});

User.get("/users/:id", authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;
  const user = await controller.getUserById(Number(id));
  res.json(user);
});

User.get("/search/users", authMiddleware.verifyToken, async (req, res) => {
  const data = req.query;
  const user = await controller.searchUser(data);
  res.json(user);
});

User.patch("/users/:id", authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await controller.updateUser(Number(id), data);
  res.json(user);
});

User.delete("/users/:id", authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;
  const user = await controller.deleteUser(Number(id));
  res.json(user);
});

export default User;