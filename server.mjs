import express from "express";
import fs from "fs";
import path from "path";
import { renderPage, cleanupMRXState } from "microrx/ssr";

const app = express();
const __dirname = path.resolve();
const renderOpts = {
  outDir: "dist/state",
  publicPath: "/__mrx_state__"
};

const jsonData = {
  user: "Jack",
  board: {
    title: "Trello Clone",
    columns: [
      {
        id: "col-1",
        name: "Todo",
        cards: [
          { id: "card-1", text: "Buy milk", tag: "low" }
        ]
      }
    ]
  }
};
const boardData = JSON.parse(
  fs.readFileSync("./dist/data/board.json", "utf-8")
);

app.get("/board", (req, res) => {
  const page = renderPage("./dist/board/board.html", boardData, renderOpts);
  console.log(page);
  res.send(page);
});

app.get("/signal", (req, res) => {
  const page = renderPage("./dist/signal/index.html", boardData, renderOpts);

  console.log("Testing signaltest page rendering:");
  console.log(page);
  res.send(page);
});

app.use("/__mrx_state__", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(express.static(path.join(__dirname, "dist")));

app.use("/__mrx_state__", express.static("dist/state"));

app.listen(3000, () => {
  console.log("SSR running at http://localhost:3000/board");
});

