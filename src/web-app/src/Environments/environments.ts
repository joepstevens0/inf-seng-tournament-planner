/**
 * @author jentevandersanden
 * Back-end API route URI's
 */
export const environment = {
  production: false,
  // LOGIN
  login:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/auth/user/login",
  getLoggedinUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/auth/user/getUser",
  logout:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/auth/user/logout",
  // USER
  createUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/create",
  readUserId:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/read/",
  readUserNick:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/readnick/",
  readAllUsers:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/read",
  updateUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/update",
  deleteUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/delete",
  updateAccount:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/update",
  updatePassword:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/updatepassword",
  banUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/ban",
  unbanUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/unban",
  verifyUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/verify",
  unverifyUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/unverify",
  allChatUsers:
  "http://localhost:5001/playconnect-20bc7/us-central1/app/api/user/readallchatusers",

  //TOURNAMENT
  createTournament:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/create",
  readTournamentId:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/read/",
  readAllTournaments:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/read",
  updateTournament:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/update",
  deleteTournament:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/delete",
  scheduleTournament:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/schedule",
  readTounamentByGame:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/readbygame/",
  selectWinner:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/selectwinner",
  isUserTeamLeader:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/isuserteamleader",
  leaveTournament:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/tournament/leavetournament",

  // TEAMFINDER
  createLobby:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/create",
  readLobbyId:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/read/",
  readAllLobbies:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/read",
  readLobbyGame:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/readbygame/",
  updateLobby:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/update",
  deleteLobby:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/delete",
  joinLobby:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/join",
  lobbyToTeam:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/toteam",
  removeLobbyPlayer:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/lobby/removeLobbyPlayer",

  // CHATBOX
  readMessages:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/chat/read/",
  messageStream:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/chat/subscribe/",
  createMessage:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/chat/create/",
  getP2PId:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/chat/p2pid/",

  // GAME
  readGameByName:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/game/read/",
  readAllGames:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/game/read",
  createGame:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/game/create",

  // TEAM
  readTeamById:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/team/read/",
  readTeamsByUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/team/readByUser/",

  // POSTS
  createPost:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/posts/create",
  readPostsForUser:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/posts/readByUser/",
  deletePost:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/posts/delete/",

  // ACHIEVEMENTS
  createAchievement:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/achievement/create",
  readAchievement:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/achievement/read/",
  deleteAchievement:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/achievement/delete/",

  // FOLLOWER
  readFollow:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/follower/read",
  readIfFriend:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/follower/readfriend",
  readFollowers:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/follower/readfollowers",
  readFollowing:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/follower/readfollowing",
  readAllFriends:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/follower/readallfriends",
  updateFollow:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/follower/update",

  //NOTIFICATION
  readNotifications:
    "http://localhost:5001/playconnect-20bc7/us-central1/app/api/notification/read",
};
