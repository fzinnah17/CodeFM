import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import UserRoutes from './routes/UserRoutes.js';
import PostRoutes from './routes/PostRoutes.js';
import CommentRoutes from './routes/CommentRoutes.js';
import ResourceRoutes from './routes/ResourceRoutes.js';
import TypeRoutes from './routes/TypeRoutes.js';
import authRoutes from './routes/auth.js';

import { pool } from './config/database.js';
import passport, {
  GitHub,
} from './config/auth.js';

const requireEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
};

const app = express();

const isProduction =
  process.env.NODE_ENV === 'production';

const clientUrl =
  process.env.CLIENT_URL ||
  'http://localhost:5173';

if (isProduction) {
  app.set('trust proxy', 1);
}

const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: requireEnv('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());

app.use(
  cors({
    origin: clientUrl,
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
    ],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(GitHub);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(
  async (id, done) => {
    try {
      const result = await pool.query(
        `
        SELECT id, username, avatarurl, githubid
        FROM "GITHUBUSER"
        WHERE id = $1
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return done(
          new Error('User not found'),
          null
        );
      }

      return done(null, result.rows[0]);
    } catch (error) {
      return done(error, null);
    }
  }
);

app.get('/', (_req, res) => {
  res.json({
    service: 'CodeFM API',
    status: 'ok',
  });
});

app.use('/auth', authRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/posts', PostRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/resources', ResourceRoutes);
app.use('/api/types', TypeRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(
    `CodeFM API listening on port ${port}`
  );
});
