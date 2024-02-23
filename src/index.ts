import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router/index";

const PORT = 8080;
const DB_USER = "digital1479";
const DB_PASS = "sTvTuKfW2o4j0lXW";
const DB_NAME = "users";
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.u4aqreu.mongodb.net/${DB_NAME}
?retryWrites=true&w=majority`;

const app = express();

app.use(
    cors({
        credentials: true,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server starting on ${PORT}`);
});

mongoose.Promise = Promise;
mongoose.connect(DB_URL);

mongoose.connection.on("error", (err: Error) => {
    console.log(err);
});

app.use("/", router());
