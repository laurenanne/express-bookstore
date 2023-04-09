process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book route tests", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");

    let book = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      year: 2017,
    });
  });

  describe("GET/book/:isbn", function () {
    test("can get book by isbn", async function () {
      const resp = await request(app).get("/books/0691161518");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        book: {
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX2",
          author: "Matthew Lane",
          language: "english",
          pages: 264,
          publisher: "Princeton University Press",
          title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
          year: 2017,
        },
      });
    });

    test("responds with 404 if can't find book", async function () {
      const resp = await request(app).get("/books/0");
      expect(resp.statusCode).toBe(404);
    });
  });

  describe("GET/books", function () {
    test("can get all books", async function () {
      const resp = await request(app).get("/books");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        books: [
          {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017,
          },
        ],
      });
    });
  });

  describe("POST/books", function () {
    test("can create a new book", async function () {
      const resp = await request(app).post("/books").send({
        isbn: "0123456",
        amazon_url: "http://a.co/eobPtX2",
        author: "Author",
        language: "english",
        pages: 100,
        publisher: "Publisher",
        title: "Test-title",
        year: 2023,
      });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        book: {
          isbn: "0123456",
          amazon_url: "http://a.co/eobPtX2",
          author: "Author",
          language: "english",
          pages: 100,
          publisher: "Publisher",
          title: "Test-title",
          year: 2023,
        },
      });
    });

    test("missing language", async function () {
      const resp = await request(app).post("/books").send({
        isbn: "9876543",
        amazon_url: "http://a.co/eobPtX2",
        author: "test",
        pages: 100,
        publisher: "PubTest",
        title: "Test-title2",
        year: 2023,
      });
      expect(resp.statusCode).toBe(400);
    });
  });

  describe("PUT/books/:isbn", function () {
    test("update a book", async function () {
      const resp = await request(app).put("/books/0691161518").send({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew P",
        language: "english",
        pages: 400,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017,
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        book: {
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX2",
          author: "Matthew P",
          language: "english",
          pages: 400,
          publisher: "Princeton University Press",
          title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
          year: 2017,
        },
      });
    });

    test("missing author", async function () {
      const resp = await request(app).put("/books/0691161518").send({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        language: "english",
        pages: 400,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017,
      });
      expect(resp.statusCode).toBe(400);
    });
  });

  describe("DELETE/books/:isbn", function () {
    test("delete a book", async function () {
      const resp = await request(app).delete("/books/0691161518");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: "Book deleted" });
    });
  });
});
afterAll(async function () {
  // close db connection
  await db.end();
});
