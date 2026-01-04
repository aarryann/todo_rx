import express from "express";
import fs from "fs";
import path from "path";
import { renderPage } from "microrx/ssr";

const app = express();
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "dist")));

app.get("/board", (req, res) => {
  const boardData = JSON.parse(
    fs.readFileSync("./dist/data/board.json", "utf-8")
  );
  const page = renderPage("./dist/board/board.html", boardData);
  //console.log(page);
  res.send(page);
});

app.get("/signaltest", (req, res) => {
  const page = fs.readFileSync("./dist/signaltest/index.html", "utf-8");

  //console.log(page);
  res.send(page);
});


app.listen(3000, () => {
  console.log("SSR running at http://localhost:3000/board");
});

