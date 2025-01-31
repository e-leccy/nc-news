# Northcoders News API

This guide will help you set up a forum-style news API. This was created using Node.js and Postgres, and is hosted using Supabase and Render.

The hosted version can be found [here](https://nc-news-j3jt.onrender.com/api/).

## Set Up and Use

### 1. Check your Node.js and Postgres version

The minimum versions are:

- Node.js: `23.3.0`
- Postgree: `16.6`

### 2. Clone the repository

- Fork the [repository](https://github.com/e-leccy/nc-news)
- Clone your fork to your local machine using `git clone <your forks's url>`

### 3. Install dependencies

- Navigate to your working directory `cd <your project folder>`
- Install all dependencies using `npm install`

### 4. Seeding the database

- Create two .env files for your project: `.env.test` and `.env.dev`.
- Into each add `PGDATABASE=<your database name`.
- These can be found in the `setup.sql` file.
- Double check that these `.env` files are in your `.gitignore` file so they are not pushed to the repository.
- Then seed using `npm run seed`

### 5. Running tests

- Run the tests with `npm run test`.
- You can specify which test suite you would like to run by appending `app` or `utils` as appropriate.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
