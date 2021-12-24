const { User, Event } = require('../models');

async function getUserProfileCommonData(userId) {
  const userInfo = await User.find(userId);
  if (userInfo === null) {
    throw Error(`Target userId '${userId}' doesn't exsit`);
  }
  const subscribersInfos = await User.getSubscribersOf(userId);
  const subscribeesInfos = await User.getSubscribeesOf(userId);
  const participatedEventsInfos = await User.getParticipatedEventsOf(userId);
  const badgeInfos = await User.getUserBadges(userId);
  const publicData = {
    username: userInfo.username,
    reputationPoints: userInfo.reputationPoints,
    subscribers: subscribersInfos,
    subscribees: subscribeesInfos,
    participatedEvents: participatedEventsInfos,
    badges: badgeInfos,
  };
  const privateData = {
    email: userInfo.email,
  };
  return {
    publicData,
    privateData,
  };
}

async function getUserProfileGuestView(userId) {
  const { publicData } = await getUserProfileCommonData(userId);
  return publicData;
}

async function getUserProfileUserView(loggedInUserId, targetUserId) {
  const { publicData } = await getUserProfileCommonData(targetUserId);
  const { subscribers } = publicData;
  const subscriberIds = new Set(subscribers.map(({ id }) => id));
  const subscribable = !subscriberIds.has(loggedInUserId);
  return {
    ...publicData,
    privateInfo: { subscribable },
  };
}

async function getUserProfileSelfView(userId) {
  const { publicData, privateData } = await getUserProfileCommonData(userId);
  return {
    ...publicData,
    privateInfo: privateData,
  };
}

async function getEventInfoGuestView(eventId) {
  const eventInfo = await Event.find(eventId);
  if (eventInfo === null) {
    throw Error(`Target event ID '${eventId}' doesn't exsit`);
  }

  const participantsInfo = await Event.getAllParticipantsOf(eventId);
  const data = { ...eventInfo, participants: participantsInfo };
  return data;
}

async function getEventInfoUserView(userId, eventId) {
  const data = await getEventInfoGuestView(eventId);
  data.privateInfo = {
    canJoin: !await User.hasUserJoinedEvent(userId, eventId),
  };
  return data;
}

async function subscribe(subscriberId, subscribeeId) {
  if (await User.isSubscribedTo(subscriberId, subscribeeId)) {
    throw Error('Subscription already exists');
  }
  return User.addSubscription(subscriberId, subscribeeId);
}

async function unsubscribe(subscriberId, subscribeeId) {
  if (!await User.isSubscribedTo(subscriberId, subscribeeId)) {
    throw Error('Subscription does not exist');
  }
  return User.removeSubscription(subscriberId, subscribeeId);
}

async function hostEvent(userId, activityId, eventName, eventDescription, eventDateTime, participantLimit ) {
  // TODO add subscription logic
   const insertId = await Event.create(
     activityId,
     eventName,
     eventDescription,
     eventDateTime,
     userId,
     participantLimit
   );
   await Event.addParticipant(insertId, userId);
   return insertId;
}

async function participateEvent(userId, eventId) {
  // TODO add subscription logic
  if (await User.hasUserJoinedEvent(userId, eventId)) {
    throw Error('User has already joined target event');
  }
  return Event.addParticipant(eventId, userId);
}

async function unparticipateEvent(userId, eventId) {
  // TODO add subscription logic
  if (!await User.hasUserJoinedEvent(userId, eventId)) {
    throw Error('User has not joined target event');
  }
  return Event.removeParticipant(eventId, userId);
}

module.exports = {
  getUserProfileGuestView,
  getUserProfileUserView,
  getUserProfileSelfView,
  getEventInfoGuestView,
  getEventInfoUserView,
  subscribe,
  unsubscribe,
  hostEvent,
  participateEvent,
  unparticipateEvent
};
