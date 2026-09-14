// server-express.mjs

import express from "express";
import { expressAdapter as microrxAdapter } from "microrx/server";

const app = await microrxAdapter(express());

app.listen(app.microrx.server.port, app.microrx.server.host, () => {
  console.log(
    `Microrx running at http://${app.microrx.server.host}:${app.microrx.server.port}`,
  );
});
