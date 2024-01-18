import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import gameRouter from './router/game.routes';
import { dbConnect } from "./configs/database.config";
dbConnect();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin:["http://localhost:4200"]
}));

app.use("/api/game", gameRouter);

const port = 3000;
app.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
})
