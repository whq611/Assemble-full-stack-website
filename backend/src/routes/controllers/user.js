const { User } = require('../../models');
const { UserService } = require('../../services');

async function getUserProfile(req, res, next) {
  try {
    const targetUserIdStr = req.params.targetUserId;
    const targetUserId = parseInt(targetUserIdStr, 10);
    const loggedInUserId = res.locals.userId;

    if (!loggedInUserId) {
      const data = await UserService.getUserProfileGuestView(targetUserId);
      res.status(200).send(data);
      return;
    }

    const data = (loggedInUserId === targetUserId)
      ? await UserService.getUserProfileSelfView(targetUserId)
      : await UserService.getUserProfileUserView(loggedInUserId, targetUserId);
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
}

async function updateUserProfile(req, res, next) {
  try {
    const targetUserId = parseInt(req.params.targetUserId, 10);
    const loggedInUserId = res.locals.userId;
    if (loggedInUserId !== targetUserId) {
      res.status(400).send({
        message: 'Profile update permission denied',
      });
    } else {
      await User.updateUserInfo(targetUserId, req.body);
      res.status(200).send(
        `Successfully udpated email of user '${targetUserId}'`,
      );
    }
  } catch (e) {
    next(e);
  }
}

async function subscribe(req, res, next) {
  try {
    const { subscribeeId } = req.body;
    const loggedInUserId = res.locals.userId;
    await UserService.subscribe(loggedInUserId, subscribeeId);
    res.status(200).send(
      { isSuccess: true, message: 'User subscription created' },
    );
  } catch (e) {
    next(e);
  }
}

async function unsubscribe(req, res, next) {
  try {
    const { subscribeeId } = req.body;
    const loggedInUserId = res.locals.userId;
    await UserService.unsubscribe(loggedInUserId, subscribeeId);
    res.status(200).send(
      { isSuccess: true, message: 'User subscription deleted' },
    );
  } catch (e) {
    next(e);
  }
}

async function participateEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const loggedInUserId = res.locals.userId;
    await UserService.participateEvent(loggedInUserId, eventId);
    res.status(200).send(
      { isSuccess: true, Message: 'User joined event' },
    );
  } catch (e) {
    next(e);
  }
}

async function unparticipateEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const loggedInUserId = res.locals.userId;
    await UserService.unparticipateEvent(loggedInUserId, eventId);
    res.status(200).send(
      { isSuccess: true, Message: 'User unjoined event' },
    );
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  subscribe,
  unsubscribe,
  participateEvent,
  unparticipateEvent,
};
