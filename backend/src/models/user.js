const db = require('./db');
const utils = require('../utils');

async function doesUsernameExist(username) {
  const sql = `
    SELECT username
    FROM User
    WHERE username = ?
`;
  const rows = await db.query(sql, [username]);
  return (rows.length !== 0);
}

async function create(username, password, email) {
  if (await doesUsernameExist(username)) {
    return false;
  }
  const passwordHash = utils.getPasswordHash(password);
  const sql = `
      INSERT INTO User (username, passwordHash, email, reputationPoints)
      VALUES (?, ?, ?, 0)
`;
  await db.query(sql, [username, passwordHash, email]);
  return true;
}

async function isSubscribedTo(subscriberId, subscribeeId) {
  const lookupSubscriptionQuery = `
    SELECT subscriber_id
    FROM UserSubscription 
    WHERE subscriber_id = ?
    AND subscribee_id = ?
`;
  const rows = await db.query(lookupSubscriptionQuery, [subscriberId, subscribeeId]);
  return (rows.length !== 0);
}

async function addSubscription(subscriberId, subscribeeId) {
  const sql = `
    INSERT INTO UserSubscription(subscriber_id, subscribee_id)
    VALUES (?, ?)
`;
  return db.query(sql, [subscriberId, subscribeeId]);
}

async function removeSubscription(subscriberId, subscribeeId) {
  const sql = `
    DELETE FROM UserSubscription
    WHERE subscriber_id = ?
    AND subscribee_id = ?
`;
  return db.query(sql, [subscriberId, subscribeeId]);
}

/**
 * `updates` is an object with the following fields:
 * - email: string
 */
async function updateUserInfo(userId, updates) {
  const { email } = updates;
  const sql = `
    UPDATE User
    SET email = ?
    WHERE id = ?
`;
  return db.query(sql, [email, userId]);
}

/**
 * Returns null or an user id integer.
 */
async function validate(username, password) {
  const passwordHash = utils.getPasswordHash(password);
  const sql = `
    SELECT id
    FROM User
    WHERE username = ? AND passwordHash = ?
`;
  const rows = await db.query(sql, [username, passwordHash]);
  return (rows.length === 0) ? null : rows[0].id;
}

/**
 * Returns null or {
 *    username: string,
 *    email: string,
 *    reputationPoints: integer,
 * }
 */
async function find(id) {
  const sql = `
    SELECT username, email, reputationPoints
    FROM User
    WHERE id = ?
`;
  const rows = await db.query(sql, [id]);
  return (rows.length === 0) ? null : rows[0];
}

/**
 * Returns an array of {
 *    id: integer,
 *    username: string,
 * }
 */
async function getSubscribersOf(id) {
  const sql = `
    SELECT User.id, User.username, User.email
    FROM User
    JOIN UserSubscription ON User.id = UserSubscription.subscriber_id
    WHERE UserSubscription.subscribee_id = ? 
`;
  return db.query(sql, [id]);
}

/**
 * Returns an array of {
 *    id: integer,
 *    username: string,
 * }
 */
async function getSubscribeesOf(id) {
  const sql = `
    SELECT User.id, User.username
    FROM User
    JOIN UserSubscription ON User.id = UserSubscription.subscribee_id
    WHERE UserSubscription.subscriber_id = ? 
`;
  return db.query(sql, [id]);
}

/**
 * Returns an array of {
 *    id: integer,
 *    name: string,
 * }
 */
async function getParticipatedEventsOf(id) {
  const sql = `
    SELECT Event.id, Event.name
    FROM EventParticipation
    JOIN Event ON Event.id = EventParticipation.event_id
    WHERE EventParticipation.user_id = ? 
`;
  return db.query(sql, [id]);
}

/**
 * Returns an array of {
 *    id: integer,
 *    name: string,
 * }
 */
async function getUserBadges(id) {
  const sql = `
    SELECT badge_id as id, Badge.name
    FROM HasBadge
    JOIN Badge ON HasBadge.badge_id = Badge.id
    where user_id = ?
    ;
`;
  return db.query(sql, [id]);
}

/**
 * Returns an array of {
 *    id: integer,
 *    username: string,
 *    subscriberCount: integer,
 * }
 * Return at most `limit` number of them.
 */
async function getUsersWithMostSubscribers(limit) {
  const sql = `
    SELECT User.id, User.username, COUNT(*) AS subscriberCount
    FROM User LEFT JOIN UserSubscription ON User.id = UserSubscription.subscribee_id
    GROUP BY User.id
    ORDER BY subscriberCount DESC
    LIMIT ?
    ;
`;
  return db.query(sql, [limit]);
}

async function hasUserJoinedEvent(userId, eventId) {
  const sql = `
    SELECT user_id
    FROM EventParticipation 
    WHERE user_id = ?
    AND event_id = ?
`;
  const rows = await db.query(sql, [userId, eventId]);
  return (rows.length !== 0);
}

module.exports = {
  create,
  addSubscription,
  removeSubscription,
  updateUserInfo,
  validate,
  find,
  getSubscribersOf,
  getSubscribeesOf,
  getParticipatedEventsOf,
  getUsersWithMostSubscribers,
  getUserBadges,
  hasUserJoinedEvent,
  isSubscribedTo,
};
