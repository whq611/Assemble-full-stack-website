/**
 * Add decoded userId integer to `res.locals` if authorization succeeds.
 */
async function authorize(req, res, next) {
  // TODO add security logic
  const loggedInUserId = req.headers.token;
  if (!loggedInUserId) {
    res.status(401).send({
      message: 'Authorization failed',
    });
    return;
  }
  res.locals.userId = parseInt(loggedInUserId, 10);
  next();
}

/**
 * Apply `authorize` only if an authorization token is provided in headers.
 */
async function authorizeOrGuest(req, res, next) {
  if (req.headers.token) {
    authorize(req, res, next);
  } else {
    next();
  }
}

module.exports = {
  authorize,
  authorizeOrGuest,
};
