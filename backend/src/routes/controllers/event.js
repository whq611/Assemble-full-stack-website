const { UserService } = require('../../services');
const { Event } = require('../../models');

async function createEvent(req, res, next) {
  try {
    const loggedInUserId = res.locals.userId;
    const { activityId, eventName, eventDescription, eventDateTime,  participantLimit } = req.body;
    const freshEventId = await UserService.hostEvent(
      loggedInUserId,
      activityId,
      eventName,
      eventDescription,
      eventDateTime,
      participantLimit
    );
    res.status(200).send({message: 'Successfully created event!', eventId: freshEventId});
  } catch (e) {
    next(e);
  }
}

async function getEventInfo(req, res, next) {
  try {
    const eventIdStr = req.params.eventId;
    const eventId = parseInt(eventIdStr, 10);
    const loggedInUserId = res.locals.userId;
    const data = loggedInUserId
      ? await UserService.getEventInfoUserView(loggedInUserId, eventId)
      : await UserService.getEventInfoGuestView(eventId);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

async function getTrendingEvents(req, res, next) {
  try {
    const data = await Event.getTrendingEvents();
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createEvent,
  getEventInfo,
  getTrendingEvents,
};
