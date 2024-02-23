import express from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { isOwner, isUserAuth } from "../middlewares";

export default (router: express.Router) => {
    router.get("/users", isUserAuth, getAllUsers);
    router.delete("/users/:id", isUserAuth, isOwner, deleteUser);
    router.patch("/users/:id", isUserAuth, isOwner, updateUser);
};
