const chai = require("chai");
const chaiHttp = require("chai-http");
const App = require("../app");
require("dotenv").config();


chai.use(chaiHttp);
const { expect } = chai;

describe("User Authentication", () => {

  let authToken;

  before(async () => {

    const authRes = await chai
      .request("http://huy_api_gateway:3003")
      .post("/auth/api/v1/login")
      .send({ username: "testuser", password: "123456" });

    authToken = authRes.body?.token || '';
  });

  after(async () => {
    // await app.authController.authService.deleteTestUsers();
    // await app.disconnectDB();
    // app.stop();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const res = await chai
        .request('http://huy_api_gateway:3003')
        .post("/auth/api/v1/register")
        .send({ username: "huy_hehehe", password: "123" });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("username", "huy_hehehe");
    });

    it("should return an error if the username is already taken", async () => {
      const res = await chai
        .request(app.app)
        .post("/register")
        .send({ username: "testuser", password: "password" });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message", "Username already taken");
    });
  });

  describe("POST /login", () => {
    it("should return a JWT token for a valid user", async () => {
      const res = await chai
        .request(app.app)
        .post("/login")
        .send({ username: "testuser", password: "password" });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");
    });

    it("should return an error for an invalid user", async () => {
      const res = await chai
        .request(app.app)
        .post("/login")
        .send({ username: "invaliduser", password: "password" });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message", "Invalid username or password");
    });

    it("should return an error for an incorrect password", async () => {
      const res = await chai
        .request(app.app)
        .post("/login")
        .send({ username: "testuser", password: "wrongpassword" });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message", "Invalid username or password");
    });
  });
});
