import express from 'express';
import passport from 'passport';

const router = express.Router();

const getPublicUser = (user) => ({
  id: user.id,
  username: user.username,
  avatarUrl: user.avatarurl,
  githubId: user.githubid,
});

router.get('/login/success', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  return res.json({
    success: true,
    user: getPublicUser(req.user),
  });
});

router.get('/login/failed', (_req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie('connect.sid');

      return res.json({
        success: true,
      });
    });
  });
});

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['read:user'],
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/login/failed',
  }),
  (_req, res) => {
    const clientUrl =
      process.env.CLIENT_URL ||
      'http://localhost:5173';

    res.redirect(clientUrl);
  }
);

export default router;
