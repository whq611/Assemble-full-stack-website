const { Event } = require('../../models');

async function searchEvents(req, res, next) {
  try {
    const { keyword, activityId } = req.query;
    const filters = {};
    if (activityId) {
      filters.activityId = parseInt(activityId, 10);
    }
    const events = await Event.search(keyword, filters);
    res.send(events);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  searchEvents,
};
