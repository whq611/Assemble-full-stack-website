const { Activity } = require('../../models');

async function getActivities(req, res, next) {
  try {
    const activities = await Activity.getAllActivitiesSortedByPopularity();
    res.send(activities);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getActivities,
};
