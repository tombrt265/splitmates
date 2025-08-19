import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Write your API routes here
// ...

app.listen(5000, () => console.log("Server läuft auf http://localhost:5000"));
