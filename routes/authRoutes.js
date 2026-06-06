const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

router.get('/logout', (req, res, next) => {
  req.logout(err => err ? next(err) : res.json({ message: 'Logged out' }));
});

router.get('/current-user', (req, res) => {
  if (!req.user) return res.json({ user: null });
  const { _id, displayName, email, avatar, role } = req.user;
  res.json({ user: { _id, displayName, email, avatar, role } });
});

module.exports = router;