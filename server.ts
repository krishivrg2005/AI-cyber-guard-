import http from "node:http";
import path from "node:path";
import app from "./artifacts/api-server/src/app";
import { wsHub } from "./artifacts/api-server/src/services/websocket";

const port = Number(process.env.PORT || 3000);
const frontendDir = path.resolve(process.cwd(), "public");
const indexFile = path.join(frontendDir, "index.html");

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api") || req.path === "/ws") {
    return next();
  }

  const relativePath = decodeURIComponent(req.path.replace(/^\/+/, ""));
  const requestedFile = path.resolve(frontendDir, relativePath);

  if (!requestedFile.startsWith(`${frontendDir}${path.sep}`)) {
    return res.status(400).end();
  }

  if (path.extname(req.path)) {
    return res.sendFile(requestedFile, (err) => {
      if (err) next();
    });
  }

  return res.sendFile(indexFile, (err) => {
    if (err) next(err);
  });
});

const server = http.createServer(app);

wsHub.init(server);

server.listen(port, "0.0.0.0", () => {
  console.log(`AI CyberGuard server listening on port ${port}`);
});
