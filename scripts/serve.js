const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8080);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(rootDir, normalizedPath);

  if (!filePath.startsWith(rootDir)) {
    return null;
  }

  if (decodedPath === "/") {
    filePath = path.join(rootDir, "index.html");
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || "/");

  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const resolvedFilePath = stats.isDirectory()
      ? path.join(filePath, "index.html")
      : filePath;
    const ext = path.extname(resolvedFilePath).toLowerCase();

    fs.readFile(resolvedFilePath, (readError, content) => {
      if (readError) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, {
        "Content-Type": contentTypes[ext] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(content);
    });
  });
});

server.listen(port, () => {
  console.log(`CRM frontend disponible en http://localhost:${port}`);
});
