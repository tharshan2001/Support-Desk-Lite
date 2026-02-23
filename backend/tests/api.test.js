// tests/api.test.js
import request from "supertest";
import server from "../server.js";
import { connect, closeDatabase, clearDatabase } from "./setup.js";
import User from "../models/user.js";
import Ticket from "../models/ticket.js";
import Comment from "../models/comment.js";
import InternalNote from "../models/Note.js";

let customerToken, agentToken, adminToken;
let customerId, agentId, adminId;
let ticketId;

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("Auth Routes", () => {
  it("should register users", async () => {
    const customer = await request(server)
      .post("/api/auth/register")
      .send({ name: "john doe", email: "customer@test.com", password: "123456" });
    expect(customer.statusCode).toBe(201);

    // agent
    const agent = await User.create({ name: "agent user", email: "agent@test.com", password: "123456", role: "agent" });
    agentId = agent._id;

    // admin
    const admin = await User.create({ name: "admin user", email: "admin@test.com", password: "123456", role: "admin" });
    adminId = admin._id;

    // login customer
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({ email: "customer@test.com", password: "123456" });
    expect(loginRes.statusCode).toBe(200);

    // safe assignment without optional chaining
    customerId = loginRes.body.user && loginRes.body.user.id ? loginRes.body.user.id : null;
    customerToken = loginRes.headers['set-cookie'][0].split(";")[0].split("=")[1];
  });

  it("should get current user", async () => {
    const res = await request(server)
      .get("/api/auth/me")
      .set("Cookie", `SDL_token=${customerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("customer@test.com");
  });
});

describe("Ticket Routes", () => {
  beforeEach(async () => {
    const customer = await User.create({ name: "john doe", email: "customer@test.com", password: "123456", role: "customer" });
    customerId = customer._id;

    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({ email: "customer@test.com", password: "123456" });

    customerToken = loginRes.headers['set-cookie'][0].split(";")[0].split("=")[1];
  });

  it("should create a ticket (customer only)", async () => {
    const res = await request(server)
      .post("/api/tickets")
      .set("Cookie", `SDL_token=${customerToken}`)
      .send({
        title: "Cannot login",
        description: "Login fails with error",
        priority: "high",
        tags: ["login", "urgent"]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Cannot login");
    ticketId = res.body._id;
  });

  it("should get my tickets (customer)", async () => {
    await Ticket.create({ title: "Test", description: "desc", priority: "low", createdBy: customerId });
    const res = await request(server)
      .get("/api/tickets/my")
      .set("Cookie", `SDL_token=${customerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.tickets.length).toBeGreaterThan(0);
  });
});

describe("Comment Routes", () => {
  beforeEach(async () => {
    const customer = await User.create({ name: "john doe", email: "customer@test.com", password: "123456", role: "customer" });
    customerId = customer._id;

    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({ email: "customer@test.com", password: "123456" });

    customerToken = loginRes.headers['set-cookie'][0].split(";")[0].split("=")[1];

    const ticket = await Ticket.create({ title: "Test Ticket", description: "desc", priority: "low", createdBy: customerId });
    ticketId = ticket._id;
  });

  it("should add a comment", async () => {
    const res = await request(server)
      .post("/api/comments")
      .set("Cookie", `SDL_token=${customerToken}`)
      .send({ ticketId, body: "This is a comment" });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.body).toBe("This is a comment");
  });

  it("should get comments for a ticket", async () => {
    await Comment.create({ ticket: ticketId, user: customerId, body: "Existing comment" });
    const res = await request(server)
      .get(`/api/comments/${ticketId}`)
      .set("Cookie", `SDL_token=${customerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe("Internal Notes Routes", () => {
  let admin, agent;

  beforeEach(async () => {
    admin = await User.create({ name: "admin", email: "admin@test.com", password: "123456", role: "admin" });
    agent = await User.create({ name: "agent", email: "agent@test.com", password: "123456", role: "agent" });

    const ticket = await Ticket.create({ title: "Test Ticket", description: "desc", priority: "low", createdBy: admin._id });
    ticketId = ticket._id;

    // login admin
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "123456" });
    adminToken = loginRes.headers['set-cookie'][0].split(";")[0].split("=")[1];

    // login agent
    const loginAgentRes = await request(server)
      .post("/api/auth/login")
      .send({ email: "agent@test.com", password: "123456" });
    agentToken = loginAgentRes.headers['set-cookie'][0].split(";")[0].split("=")[1];
  });

  it("admin can add internal note", async () => {
    const res = await request(server)
      .post("/api/notes")
      .set("Cookie", `SDL_token=${adminToken}`)
      .send({ ticketId, body: "Internal note by admin" });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("agent can get internal notes", async () => {
    await InternalNote.create({ ticket: ticketId, user: agent._id, body: "Note by agent" });
    const res = await request(server)
      .get(`/api/notes/${ticketId}`)
      .set("Cookie", `SDL_token=${agentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});