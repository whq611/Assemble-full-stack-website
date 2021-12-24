const ActivityController = require('./controllers/activity');
const AuthController = require('./controllers/auth');
const LeaderboardController = require('./controllers/leaderboard');
const SearchController = require('./controllers/search');
const UserController = require('./controllers/user');
const EventController = require('./controllers/event');
const { authorize, authorizeOrGuest } = require('./middlewares');

function addRoutes(app) {
  /**
   * Return an array of {
   *   id: integer,
   *   name: string,
   *   eventCount: integer,
   * }
   */
  app.get('/activities', ActivityController.getActivities);
  /**
   * Return an array of {
   *   id: integer,
   *   name: string,
   *   description: string,
   * }
   */
  app.get('/search', SearchController.searchEvents);
  /**
   * Return an array of {
   *   id: integer,
   *   username: string,
   *   subscriberCount: integer,
   * }
   */
  app.get('/leaderboard', LeaderboardController.getLeaderboardUsers);
  /**
   * Return an array of {
   *   id: integer,
   *   name: string,
   *   description: string,
   *   popularityStatus: 'Hot' | 'Fire' | 'Boom'
   * }
   */
  app.get('/trending-events', EventController.getTrendingEvents);
  /**
   * Return {
   *   username: string,
   *   reputationPoints: number,
   *   subscribers: [List UserInfo],
   *   subscribees: [List UserInfo],
   *   participatedEvents: [List EventInfo],
   *   badges: [List BadgeInfo]
   *   privateInfo: PrivateUserInfo,
   *   otherUserInfo:
   * }
   *
   * UserInfo is a { username: string, id: number }
   * EventInfo is a { name: string, id: number }
   * BadgeInfo is a { name: string, id: number }
   * PrivateUserInfo is a { email: string, subscribable: bool }
   *
   * Note that PrivateUserInfo is available only if the user has logged-in, and
   * - `email` field is present only if the user is viewing his own profile
   * - `subscribable` field is present only if the user is viewing other's profile
   */
  app.get('/profile/:targetUserId', authorizeOrGuest, UserController.getUserProfile);
  /**
   * Return {
   *   name : string,
   *   description: string,
   *   participatns: [List UserInfo]
   *   privateInfo: PrivateUserInfo
   * }
   *
   * UserInfo is a { username: string, id: number }
   * PrivateUserInfo is a { canJoin: bool }
   *
   * NOTE PrivateUserInfo is available only if the user has logged-in.
   */
  app.get('/event/:eventId', authorizeOrGuest, EventController.getEventInfo);

  app.post('/signup', AuthController.signup);
  app.post('/login', AuthController.login);
  app.post('/profile/:targetUserId', authorize, UserController.updateUserProfile);
  app.post('/subscribe', authorize, UserController.subscribe);
  app.post('/event', authorize, EventController.createEvent);
  app.post('/event-participation/:eventId', authorize, UserController.participateEvent);

  app.delete('/subscribe', authorize, UserController.unsubscribe);
  app.delete('/event-participation/:eventId', authorize, UserController.unparticipateEvent);
}

module.exports = {
  addRoutes,
};
