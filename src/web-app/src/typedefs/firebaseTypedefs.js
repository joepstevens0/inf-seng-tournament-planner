/**
 * @author jentevandersanden
 * This file describes the typedefs for objects stored in Google Firestore.
 */

/**
 * USERACHIEVEMENT OBJECT
 * @typedef {Object} UserAchievement
 * @property {number} date
 * @property {string} id
 */

/**
 * USER OBJECT
 * @typedef {Object} User
 * @property {string} id
 * @property {Array<UserAchievement>} achievements
 * @property {string} bio
 * @property {string} email
 * @property {TimeStamp} joinDate
 * @property {Array<string>} followers
 * @property {Array<string>} following
 * @property {string} nickname
 * @property {string} password
 * @property {boolean} isAdmin
 * @property {boolean} isBanned
 * @property {boolean} isVerified
 * @property {Array<PCskillLevel>} skillLevels
 */

/**
 * ACHIEVEMENT OBJECT
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string} tier
 * @property {string} tournamentId
 * @property {string} type
 */

/**
 * PCSKILLLEVEL OBJECT
 * @typedef {Object} PCskillLevel
 * @property {string} game
 * @property {number} pcEloRating
 * @property {string} pcSkillTier
 */

/**
 * PCSKILLTIER OBJECT
 * @typedef {Object} PCSkillTier
 * @property {string} name
 * @property {number} minimumElo
 * @property {number} maximumElo
 * @property {string} iconPath
 *
 */

/**
 * TOURNAMENT OBJECT
 * @typedef {Object} Tournament
 * @property {string} id
 * @property {string} name
 * @property {string} gameName
 * @property {string} description
 * @property {TimeStamp} startDate
 * @property {TimeStamp} endDate
 * @property {string} bannerPath
 * @property {string} organiserId
 * @property {number} amountTeams
 * @property {number} teamSize
 * @property {Array<Team>} teams
 * @property {Array<Array<Match>>} schedule
 * @property {string} format
 * @property {Prize} prize
 * @property {PCskillTier} skillTier
 * @property {Array<Achievement>} achievements
 * @property {number} currentStage
 * @property {boolean} hasBegun
 * @property {Map<string, number>} scores
 */

/**
 * TEAM OBJECT
 * @typedef {Object} Team
 * @property {string} id
 * @property {string} name
 * @property {Array<string>} playerIds
 * @property {string} teamLeader
 * @property {string} tournamentId
 */

/**
 * MATCH OBJECT
 * @typedef {Object} Match
 * @property {string} team1Id
 * @property {string} team2Id
 * @property {string} winner
 */

/** LOBBY OBJECT
 * @typedef {Object} Lobby
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {Array<string>} playerIds
 * @property {string} ownerId
 * @property {string} tournamentId
 * @property {number} maxPlayers
 * @property {string} gameName
 * @property {string} chatId
 */

/** POST OBJECT
  * @typedef {Object} Post
  * @property {string} postId
  * @property {string} description
  * @property {number} postDate
  * @property {string} userId
  * @property {Array<string>} achievementIds
/**
 * CHATMESSAGE OBJECT
 * @typedef {Object} ChatMessage
 * @property {string} message
 * @property {number} time
 * @property {string} senderId
 */

/**
 * GAME OBJECT
 * @typedef {Object} Game
 * @property {string} name
 * @property {string} description
 */

/**
 * NOTIFICATION OBJECT
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} link
 */

export default module;
