/**
 * @author jentevandersanden
 * This file describes the typedefs for objects stored in Google Firestore.
 */

/**
 * USER OBJECT
 * @typedef {Object} User
 * @property {string} id
 * @property {Array<Achievement>} achievements
 * @property {string} bio
 * @property {string} email
 * @property {TimeStamp} joinDate
 * @property {Array<User>} followers
 * @property {Array<User>} following
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
  * @property {string} description
  * @property {string} icon
  * @property {string} tier
  * @property {string} tournament_id 
  */

/**
   * PCSKILLLEVEL OBJECT
   * @typedef {Object} PCskillLevel
   * @property {string} game
   * @property {number} pc_elo_rating
   * @property {string} pc_skill_tier
   */

/**
    * PCSKILLTIER OBJECT
    * @typedef {Object} PCSkillTier
    * @property {string} name
    * @property {number} minimum_elo
    * @property {number} maximum_elo
    * @property {string} icon_path
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
  * @typedef {Object} Team
  * @property {string} id
  * @property {string} name
  * @property {Array<string>} playerIds
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
