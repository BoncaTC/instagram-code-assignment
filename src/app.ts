import express from "express";

const app = express();
app.use(express.json());

app.use("/instagram", require("../controller/instagram"));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
