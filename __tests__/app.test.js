const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
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
  test("200: Should return an array of objects with the properties of slug & description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(typeof topic).toBe("object");
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
describe("GET /api/articles/:articleID", () => {
  test(`200: Should return an article object with the following properties
    author, title, article_id, body, topic, created_at, votes, article_img_id`, () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.article_id).toBe(3),
          expect(article.title).toBe("Eight pug gifs that remind me of mitch"),
          expect(article.topic).toBe("mitch"),
          expect(article.author).toBe("icellusedkars"),
          expect(article.body).toBe("some gifs"),
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z"),
          expect(article.votes).toBe(0),
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
      });
  });
  test("404: should return a custom error when an out of range ID is used", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Article Not Found");
      });
  });
  test("400: should return an error when a non-integar is used", () => {
    return request(app)
      .get("/api/articles/NaN")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Invalid Input");
      });
  });
});

describe("GET /api/articles", () => {
  test(`200: should return an article array of objects with the properties:
    author, title, article_id, topic, created_at, votes, article_img_url,
    comment_count (and no body)`, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: should be sorted by date (created_at) descending ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test(`200: should return an array of comments for the given article_id
    each comment should have the following properties:
    comment_id, votes, created_at, author, body, article_id `, () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: should be sorted by created_at, most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: should return an empty array if article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(0);
      });
  });
  test("404: should return an error if an out-of-range articleID used", () => {
    return request(app)
      .get("/api/articles/9000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Article Not Found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test(`201: should accept an object with username and body
    and return a posted comment`, () => {
    return request(app)
      .post("/api/articles/8/comments")
      .send({
        username: "icellusedkars",
        body: "lol no",
      })
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.body).toBe("lol no");
        expect(comment.author).toBe("icellusedkars");
        expect(comment.article_id).toBe(8);
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        });
      });
  });
  test("400: should return an error if a key is missing", () => {
    return request(app)
      .post("/api/articles/8/comments")
      .send({
        username: "icellusedkars",
      })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Missing Key");
      });
  });
  test("400: should return an error when invalid datatype/input used", () => {
    return request(app)
      .post("/api/articles/8/comments")
      .send({
        username: "isellusedcars",
        body: "lol no",
      })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test(`200: should access an object ({ inc_votes : newVote }), update votes
  and return the updated article`, () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.updatedArticle;
        expect(updatedArticle.votes).toBe(5);
      });
  });
  test(`400: should return an error if no content included in the patch request`, () => {
    return request(app)
      .patch("/api/articles/5")
      .send({})
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Missing Key");
      });
  });
  test("400: should return an error when invalid datatype/input used", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: "five" })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
  test("404: should return custom error if article out of range", () => {
    return request(app)
      .patch("/api/articles/9000")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Article Not Found");
      });
  });
  test("400: should return an error when article_id is not an integar", () => {
    return request(app)
      .patch("/api/articles/NaN")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete specified comment by comment_id, respond with no content ", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });
  test("404 - should return a custom error when an out of range ID is used", () => {
    return request(app)
      .delete("/api/comments/9000")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Comment Not Found");
      });
  });
  test("400: should return an error when incorrect paramaters used", () => {
    return request(app)
      .delete("/api/comments/NaN")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Invalid Input");
      });
  });
});
describe("GET /api/users", () => {
  test(`200: should return an array of objects with the properties
    username, name, avatar_url`, () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api/articles - Sorting Queries", () => {
  test("200: should be sorted by author, default order desc", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSorted({ key: "author", descending: true });
      });
  });
  test("200: should be sorted by author, order asc", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSorted({ key: "author", ascending: true });
      });
  });
  test("200: should be sorted by topic, order desc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=desc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSorted({ key: "topic", descending: true });
      });
  });
  test("200: should be sorted by topic, order asc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSorted({ key: "topic", ascending: true });
      });
  });
  test("400: should return an error if ordered with an incorrect parameter", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=random")
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
  test("404: should return a custom error if sorted by a blacklisted value", () => {
    return request(app)
      .get("/api/articles?sort_by=somethingelse")
      .expect(404)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
});
describe("GET /api/articles - Topic Query", () => {
  test("200: should filter articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test(`404: should return a custom error message if filtered on a topic with no articles`, () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("No Articles Found");
      });
  });
});
describe("GET /api/articles/:article_id - Comment Count", () => {
  test("200: adds comment count to the article object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.article_id).toBe(3),
          expect(article.title).toBe("Eight pug gifs that remind me of mitch"),
          expect(article.topic).toBe("mitch"),
          expect(article.author).toBe("icellusedkars"),
          expect(article.body).toBe("some gifs"),
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z"),
          expect(article.votes).toBe(0),
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          ),
          expect(article.comment_count).toBe(2);
      });
  });
});
describe("GET /api/users/:username", () => {
  test(`200: should return a user object with the following properties:
    username, avatar_url, name`, () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then((response) => {
        const user = response.body.user;
        expect(user.username).toBe("icellusedkars"),
          expect(user.name).toBe("sam");
        expect(user.avatar_url).toBe(
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
        );
      });
  });
  test("404: should return a custom error if invalid username used", () => {
    return request(app)
      .get("/api/users/isellusedcars")
      .expect(404)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("User Not Found");
      });
  });
});
describe("PATCH /api/comments/comment_id", () => {
  test(`200: should access and object ({inc_votes: newVote}), update votes
    and return an updated comment`, () => {
    return request(app)
      .patch("/api/comments/5")
      .send({ inc_votes: -5 })
      .expect(200)
      .then((response) => {
        const updatedComment = response.body.updatedComment;
        expect(updatedComment.votes).toBe(-5);
      });
  });
  test(`400: should return an error if no content included in the patch request`, () => {
    return request(app)
      .patch("/api/comments/5")
      .send({})
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Missing Key");
      });
  });
  test("400: should return an error when invalid datatype/input used", () => {
    return request(app)
      .patch("/api/comments/5")
      .send({ inc_votes: "five" })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
  test("404: should return custom error if comment out of range", () => {
    return request(app)
      .patch("/api/comments/9000")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Comment Not Found");
      });
  });
  test("400: should return an error when comment_id is not an integar", () => {
    return request(app)
      .patch("/api/comments/NaN")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
});
describe("POST /api/articles", () => {
  test(`201: should accept an object with the following:
    author, title, body, topic (optional - article_img_url)
    and return a new article with the above properties and:
    article_id, votes, created at, comment count`, () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Mitch is cancelled",
        author: "butter_bridge",
        body: "I have had a change of heart and can no longer support Mitch",
        topic: "mitch",
      })
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(14),
          expect(article.title).toBe("Mitch is cancelled"),
          expect(article.topic).toBe("mitch"),
          expect(article.author).toBe("butter_bridge"),
          expect(article.body).toBe(
            "I have had a change of heart and can no longer support Mitch"
          ),
          expect(article).toHaveProperty("created_at");
        expect(article.votes).toBe(0),
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
          ),
          expect(article.comment_count).toBe(0);
      });
  });
  test("400: should return an error if a key is missing", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Mitch is cancelled",
        author: "butter_bridge",
        body: "I have had a change of heart and can no longer support Mitch",
      })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Missing Key");
      });
  });
  test("400: should return an error when invalid datatype/input entered", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Mitch is cancelled",
        author: "butterbridge",
        body: "I have had a change of heart and can no longer support Mitch",
        topic: "invalid_topic",
      })
      .expect(400)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("Invalid Input");
      });
  });
});
describe("GET /api/articles (pagination)", () => {
  test(`200: Should return an article array of objects, limited to the first 6.
    total_count should be added and return 13`, () => {
    return request(app)
      .get("/api/articles?limit=6&p=1")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const total_count = response.body.total_count;
        expect(articles).toHaveLength(6);
        expect(total_count).toBe(13);
      });
  });
  test(`200: Should return an article array of objects, limited to the last 1`, () => {
    return request(app)
      .get("/api/articles?limit=6&p=3")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(1);
      });
  });
  test("404: Should return a custom error if no articles on queried page", () => {
    return request(app)
      .get("/api/articles?limit=6&p=4")
      .expect(404)
      .then((response) => {
        const error = response.body.error;
        expect(error).toBe("No Articles Found");
      });
  });
});
