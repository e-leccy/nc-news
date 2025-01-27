const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("Should return a status response of 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test.only("200: Should return an array of objects with the properties of slug & description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        const topics = result.body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(typeof topic).toBe("object");
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
