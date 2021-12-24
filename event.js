const db = require('./db');

async function create(
  activityId,
  name,
  description,
  eventDateTime,
  hostId,
  participantLimit
) {
  const sql = `
    INSERT INTO Event (activity_id, name, description, event_start_time, host_id, participant_limit)
    VALUES
    (?, ?, ?, ?, ?, ?);
    SELECT LAST_INSERT_ID();
  `;
  const row = await db.query(sql, [
    activityId,
    name,
    description,
    eventDateTime,
    hostId,
    participantLimit,
  ]);
  return row[0].insertId; 
}

async function addParticipant(eventId, userId) {
  const sql = `
    INSERT INTO EventParticipation(user_id, event_id)
    VALUES (?, ?)
`;
  return db.query(sql, [userId, eventId]);
}

async function removeParticipant(eventId, userId) {
  const sql = `
    DELETE FROM EventParticipation
    WHERE user_id = ?
    AND event_id = ?
`;
  return db.query(sql, [userId, eventId]);
}

/**
 * Returns null or {
 *    id: integer,
 *    name: string,
 * }
 */
async function find(id) {
  const sql = `
  SELECT name, username, description, event_start_time, creation_time, host_id, participant_limit
  FROM Event LEFT JOIN User ON (User.id = host_id)
  WHERE Event.id = ?;
`;
  const rows = await db.query(sql, [id]);
  return (rows.length === 0) ? null : rows[0];
}

/**
 * Return all the events that
 * 1. have `substr` in their names
 * 2. satisfy options in the `filters` object.
 *
 * `filters` is an object with optional fields: {
 *    activityId: integer
 * }
 */
async function search(substr, filters) {
  let sql = `
    SELECT id, name, description
    FROM Event
    WHERE name LIKE ? 
  `;
  const params = [`%${substr}%`];

  if ('activityId' in filters) {
    sql += 'AND activity_id = ?\n';
    params.push(filters.activityId);
  }
  return db.query(sql, params);
}

/**
 * Returns an array of {
 *    id: integer,
 *    username: string,
 * }
 */
async function getAllParticipantsOf(id) {
  const sql = `
    SELECT User.id, User.username
    FROM User JOIN EventParticipation
    ON User.id = EventParticipation.user_id
    WHERE EventParticipation.event_id = ?
`;
  return db.query(sql, [id]);
}

async function getTrendingEvents() {
  const sql = `
    call TrendingEvents();
`;
  const res = await db.query(sql);
  return res[0];
}

module.exports = {
  create,
  addParticipant,
  removeParticipant,
  find,
  search,
  getAllParticipantsOf,
  getTrendingEvents,
};
