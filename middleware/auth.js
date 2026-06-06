exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

exports.isOrganizer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'organizer') return next();
  res.status(403).json({ message: 'Organizer only' });
};