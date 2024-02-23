import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { random, startAuth } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }

        // * Select user by email
        const user = await getUserByEmail(email).select("+auth.salt +auth.password");
        if (!user) {
            return res.sendStatus(400);
        }
        // * Add expectedHash for check by token
        const expectedCash = startAuth(user.auth.salt, password);
        if (user.auth.password !== expectedCash) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.auth.sessionToken = startAuth(salt, user._id.toString());
        await user.save();

        res.cookie("TEST-AUTH", user.auth.sessionToken, { domain: "localhost", path: "/" });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !password || !username) return res.sendStatus(400);

        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.sendStatus(400);

        const salt = random();
        const user = await createUser({
            email,
            username,
            auth: {
                salt,
                password: startAuth(salt, password),
            },
        });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
