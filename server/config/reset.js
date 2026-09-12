import { pool } from './database.js';

const createUserTable = `
CREATE TABLE IF NOT EXISTS "GITHUBUSER" (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatarurl TEXT,
  githubid TEXT UNIQUE
);
`;

const createPostTable = `
CREATE TABLE IF NOT EXISTS "POST" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  userId INTEGER REFERENCES "GITHUBUSER"(id)
);
`;

const createCommentTable = `
CREATE TABLE IF NOT EXISTS "COMMENT" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  postId INTEGER REFERENCES "POST"(id)
);
`;

const createTypeTable = `
CREATE TABLE IF NOT EXISTS "TYPE" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
`;

const createResourceTable = `
CREATE TABLE IF NOT EXISTS "RESOURCE" (
  id SERIAL PRIMARY KEY,
  link VARCHAR(255) NOT NULL,
  typeId INTEGER REFERENCES "TYPE"(id),
  userId INTEGER REFERENCES "GITHUBUSER"(id)
);
`;

const createUserResourceTable = `
CREATE TABLE IF NOT EXISTS "USER_RESOURCE" (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES "GITHUBUSER"(id),
  resourceId INTEGER REFERENCES "RESOURCE"(id),
  UNIQUE(userId, resourceId)
);
`;

const createTables = async () => {
  try {
    await pool.query(createUserTable);

    // Older versions of CodeFM stored GitHub OAuth
    // access tokens. They are no longer needed.
    await pool.query(
      'ALTER TABLE "GITHUBUSER" DROP COLUMN IF EXISTS accesstoken'
    );

    await pool.query(createPostTable);
    await pool.query(createCommentTable);
    await pool.query(createTypeTable);
    await pool.query(createResourceTable);
    await pool.query(createUserResourceTable);

    console.log('Database schema ready.');
  } catch (error) {
    console.error(
      'Unable to initialize database schema:',
      error.message
    );

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

createTables();
