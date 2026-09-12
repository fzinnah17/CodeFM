import { pool } from './database.js';
import GithubStrategy from 'passport-github2';
import passport from 'passport';

const requireEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const options = {
  clientID: requireEnv('GITHUB_CLIENT_ID'),
  clientSecret: requireEnv('GITHUB_CLIENT_SECRET'),
  callbackURL:
    process.env.GITHUB_CALLBACK_URL ||
    'http://localhost:3001/auth/github/callback',
};

const verify = async (
  _accessToken,
  _refreshToken,
  profile,
  callback
) => {
  const { id, login, avatar_url } = profile._json;

  if (!login) {
    return callback(
      new Error('GitHub username is required'),
      null
    );
  }

  try {
    const existingUser = await pool.query(
      `
      SELECT id, username, avatarurl, githubid
      FROM "GITHUBUSER"
      WHERE username = $1
      `,
      [login]
    );

    if (existingUser.rows.length > 0) {
      const updatedUser = await pool.query(
        `
        UPDATE "GITHUBUSER"
        SET githubid = $1,
            avatarurl = $2
        WHERE username = $3
        RETURNING id, username, avatarurl, githubid
        `,
        [id, avatar_url, login]
      );

      return callback(null, updatedUser.rows[0]);
    }

    const insertedUser = await pool.query(
      `
      INSERT INTO "GITHUBUSER"
        (githubid, username, avatarurl)
      VALUES
        ($1, $2, $3)
      RETURNING id, username, avatarurl, githubid
      `,
      [id, login, avatar_url]
    );

    return callback(null, insertedUser.rows[0]);
  } catch (error) {
    return callback(error);
  }
};

export const GitHub = new GithubStrategy(
  options,
  verify
);

export default passport;
