const { User } = require('../../models');

async function getLeaderboardUsers(req, res, next) {
  try {
    const users = await User.getUsersWithMostSubscribers(100);
    res.send(users);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getLeaderboardUsers,
};
