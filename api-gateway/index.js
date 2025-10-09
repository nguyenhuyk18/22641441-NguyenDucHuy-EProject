const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// Route requests to the auth service
app.use("/auth", (req, res) => {
  req.url = req.url.replace(/^\/auth\//, '');
  // console.log(req.url)
  proxy.web(req, res, { target: "http://127.0.0.1:3000" });
});

// Route requests to the product service
app.use("/products", (req, res) => {
  req.url = req.url.replace(/^\/products\//, '');
  proxy.web(req, res, { target: "http://127.0.0.1:3001" });
});

// Route requests to the order service
app.use("/orders", (req, res) => {
  req.url = req.url.replace(/^\/orders\//, '');
  proxy.web(req, res, { target: "http://127.0.0.1:3002" });
});

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
