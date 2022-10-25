import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import ejs from "ejs";
import _ from "lodash";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) => {
     res.render("home");
})

app.post("/", (req, res) => {
     console.log(req.body.text);
})







app.listen(3000, () => {
     console.log("Server started on port 3000");
})
