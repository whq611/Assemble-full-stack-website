const db = require('./db');

/**
 * Popularity is defined as # of event instances for an activity.
 * Returns an array of {
 *    id: integer,
 *    name: string,
 *    eventCount: integer,
 * }
 */
async function getAllActivitiesSortedByPopularity() {
  const sql = `
      SELECT Activity.id, Activity.name, COUNT(Event.id) AS eventCount
      FROM Activity LEFT JOIN Event ON Activity.id = Event.activity_id
      GROUP BY Activity.id
      ORDER BY eventCount DESC;
`;
  return db.query(sql);
}

module.exports = {
  getAllActivitiesSortedByPopularity,
};
