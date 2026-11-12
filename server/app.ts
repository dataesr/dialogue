import express, { type Express, type Request, type Response } from 'express';
import path from "path";

const app: Express = express();

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(3000);