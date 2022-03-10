import express from "express";
import { router as instagram } from "../controller/instagram";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/instagram", instagram);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
