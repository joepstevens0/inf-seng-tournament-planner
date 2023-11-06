"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userIdGeneration_1 = require("../services/userIdGeneration");
const schedule_1 = require("../services/schedule");
const authToken_1 = require("../services/authToken");
const formats_1 = require("../services/Enums/formats");
const converters_1 = require("../services/converters");
const tournamentUpdater_1 = require("../services/tournamentUpdater");
const checkIfStageCompleted_1 = require("../services/checkIfStageCompleted");
const notificationHelper_1 = require("../services/notificationHelper");
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
const db = admin.firestore();
/**
 * --------------------------------------
 * 			TOURNAMENT ROUTES
 * --------------------------------------
 */
// CREATE TOURNAMENT
router.post('/create', async (req, res) => {
    (async () => {
        try {
            let tournamentData = req.body.data;
            let userId = req.body.userId;
            // Check if user is authenticated
            const correctToken = await authToken_1.authenticateToken(userId);
            if (!correctToken)
                return res.status(401).send({ message: 'Unauthorized' });
            // We need to create a unique ID and joinDate at server side
            tournamentData.id = await userIdGeneration_1.generateUniqueID();
            tournamentData.organiserId = userId;
            // Convert start and end date into a timestamp
            if (tournamentData.startDate != '')
                tournamentData.startDate = admin.firestore.Timestamp.fromDate(new Date(tournamentData.startDate));
            if (tournamentData.endDate != '')
                tournamentData.endDate = admin.firestore.Timestamp.fromDate(new Date(tournamentData.endDate));
            if (!Object.values(formats_1.ScheduleFormat).includes(tournamentData.format))
                return res.status(400).send();
            for (let i = 0; i < tournamentData.achievements.length; ++i) {
                tournamentData.achievements[i].id = await userIdGeneration_1.generateUniqueID();
            }
            const userRef = db.collection('users').doc(userId);
            const tournamentRef = db.collection('tournaments').doc('/' + tournamentData.id + '/');
            await db.runTransaction(async (transaction) => {
                // get user
                const userDoc = await transaction.get(userRef);
                const userData = userDoc.data();
                if (userData.isVerified || userData.isAdmin) {
                    // create achievements
                    for (let i = 0; i < tournamentData.achievements.length; ++i) {
                        const achievement = tournamentData.achievements[i];
                        const achievementRef = db.collection('achievements').doc(achievement.id);
                        await transaction.set(achievementRef, achievement);
                        tournamentData.achievements[i] = {
                            id: achievement.id,
                            type: achievement.type
                        };
                    }
                }
                // insert into firestore
                await transaction.set(tournamentRef, tournamentData);
                console.debug('Tournament Successfully Created!');
            });
            return res.status(200).send({ message: 'Tournament Successfully Created!', tournament: tournamentData });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
// GET TOURNAMENT
router.post('/read/:id', async (req, res) => {
    (async () => {
        try {
            const correctToken = await authToken_1.authenticateToken(req.body.userId);
            if (correctToken) {
                try {
                    let tournDoc = await db.collection('tournaments').doc(req.params.id).get();
                    let tournObj = tournDoc.data();
                    // Convert the schedule into a nested array
                    tournObj.schedule = converters_1.convertFirestoreObjectToNestedArray(tournObj.schedule);
                    return res.status(200).send(tournObj);
                }
                catch (error) {
                    console.error(error);
                    return res.status(500).send(error);
                }
            }
            else {
                // If user isn't authorized to request this data (isn't logged in)
                return res.status(401).send('Unauthorized');
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// SCHEDULE TOURNAMENT
router.post('/schedule', (req, res) => {
    (async () => {
        try {
            let tournamentId = req.body.tournamentId;
            let userId = req.body.userId;
            const correctToken = await authToken_1.authenticateToken(userId);
            if (!correctToken)
                return res.status(401).send('Unauthorized');
            let tournDoc = await db.collection('tournaments').doc(tournamentId).get();
            // If the organizerId doesn't match the userId of the request, this user has no permission
            if (tournDoc.data().organiserId != userId)
                return res.status(401).send();
            // If the tournament is not full yet, it's a bad request
            if (tournDoc.data().teams.length != parseInt(tournDoc.data().amountTeams))
                return res.status(405).send();
            // SCHEDULE INITIALIZATION
            let teams = tournDoc.data().teams;
            let format = tournDoc.data().format;
            let scheduleResult = schedule_1.schedule(format, teams);
            // Convert to Firestore format (Firestore doesn't support nested arrays)
            let converted = converters_1.convertNestedArrayToFirestoreObject(scheduleResult);
            console.debug(converted);
            // SCORE MAP INITIALIZATION (For now only be used by round-robin tournaments)
            let teamScores = {};
            teams.forEach((team) => {
                teamScores[team] = 0;
            });
            // Insert the result into the database
            await db.collection('tournaments').doc(tournamentId).update({
                schedule: converted,
                hasBegun: true,
                scores: teamScores
            });
            let users = await getUsersFromTournament(tournamentId);
            await notificationHelper_1.handleNotification('Your tournament has begun', 'A tournament you signed up for just started! Go check the schedule!', '/tournament/' + tournamentId, users);
            return res.status(200).send({ schedule: converted });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// UPDATE TOURNAMENT AFTER A MATCH WAS WON
router.post('/selectwinner', (req, res) => {
    (async () => {
        try {
            let winnerIds = req.body.winners;
            let tournamentId = req.body.tournamentId;
            let userId = req.body.userId;
            let isDraw = req.body.draw;
            // Check if user is authenticated
            const correctToken = await authToken_1.authenticateToken(userId);
            if (!correctToken)
                return res.status(401).send({ message: 'Unauthorized' });
            let tournDoc = await db.collection('tournaments').doc(tournamentId).get();
            // If the organizerId doesn't match the userId of the request, this user has no permission
            if (tournDoc.data().organiserId != userId)
                return res.status(401).send();
            // Update the schedule according to who won
            let tournObject = tournDoc.data();
            let tournamentFormat = tournObject.format;
            let currentSchedule = tournObject.schedule;
            let currentScheduleNested = converters_1.convertFirestoreObjectToNestedArray(currentSchedule);
            let currentStage = tournObject.currentStage;
            let scoreMap = tournObject.scores;
            let updateResult = tournamentUpdater_1.selectWinner(tournamentFormat, currentScheduleNested, currentStage, winnerIds, scoreMap, isDraw);
            console.debug(updateResult.schedule);
            let resultConverted = new Array();
            resultConverted = converters_1.convertNestedArrayToFirestoreObject(updateResult.schedule);
            const stageIsComplete = checkIfStageCompleted_1.checkIfStageCompleted(tournObject.currentStage, updateResult.schedule);
            if (stageIsComplete) {
                tournObject.currentStage = tournObject.currentStage + 1;
            }
            // start transaction
            await db.runTransaction(async (transaction) => {
                const teamObjects = [];
                console.debug(tournObject);
                for (let i = 0; i < tournObject.teams.length; ++i) {
                    const teamId = tournObject.teams[i];
                    console.debug(teamId);
                    const teamRef = db.collection('teams').doc(teamId);
                    const teamDoc = await transaction.get(teamRef);
                    const teamData = teamDoc.data();
                    teamObjects.push(teamData);
                }
                console.debug('END');
                // In a round-robin tournament we need to update the scores, in single elim and double elim we need
                // to update the tournament's schedule.
                if (tournamentFormat == formats_1.ScheduleFormat.RoundRobin) {
                    // Insert the result into the database
                    await transaction.update(db.collection('tournaments').doc(tournamentId), {
                        scores: updateResult.scores,
                        schedule: resultConverted,
                        currentStage: tournObject.currentStage
                    });
                }
                else {
                    // Insert the result into the database
                    await transaction.update(db.collection('tournaments').doc(tournamentId), {
                        schedule: resultConverted,
                        currentStage: tournObject.currentStage
                    });
                }
                if (stageIsComplete && currentSchedule[currentStage].length <= 2) {
                    console.debug('Sending achievements');
                    // give achievements to users
                    for (let i = 0; i < tournObject.achievements.length; ++i) {
                        const achievement = tournObject.achievements[i];
                        console.debug(achievement);
                        if (achievement.type == 'winner') {
                            // give only to winners
                            for (let i = 0; i < teamObjects.length; ++i) {
                                const team = teamObjects[i];
                                for (let j = 0; j < winnerIds.length; ++j) {
                                    const winnerId = winnerIds[j];
                                    if (winnerId == team.id)
                                        await giveAchievementToTeam(transaction, team, achievement.id);
                                }
                            }
                        }
                        else if (achievement.type == 'participant') {
                            // give to all players in tournament
                            for (let i = 0; i < teamObjects.length; ++i) {
                                const team = teamObjects[i];
                                await giveAchievementToTeam(transaction, team, achievement.id);
                            }
                        }
                    }
                }
            });
            let users = await getUsersFromTournament(tournamentId);
            await notificationHelper_1.handleNotification('Your tournament has new updates', 'Your tournament has had some new updates about the scedule, go check them out!', '/tournament/' + tournamentId, users);
            return res.status(200).send({ result: updateResult });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// GET TOURNAMENTS BY GAME NAME
router.get('/readbygame/:gameName', async (req, res) => {
    (async () => {
        console.debug('readbygame:', req.params.gameName);
        try {
            let tournamentDocs = await db.collection('tournaments').where('gameName', '==', req.params.gameName).get();
            return res.status(200).send(tournamentDocs.docs.map((doc) => doc.data()));
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// GET ALL TOURNAMENTS
router.get('/read', async (req, res) => {
    (async () => {
        try {
            let tournamentsDocs = await db.collection('tournaments').get();
            return res.status(200).send(tournamentsDocs.docs.map((doc) => doc.data()));
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// CHECK IF CERTAIN USER IS LEADER IN TOURNAMENT
router.post('/isuserteamleader', async (req, res) => {
    (async () => {
        try {
            const correctToken = await authToken_1.authenticateToken(req.body.userId);
            if (correctToken) {
                try {
                    let tournDoc = await db.collection('tournaments').doc(req.body.tournamentId).get();
                    let tournObj = tournDoc.data();
                    let teams = tournObj.teams;
                    let response = false;
                    for (let i = 0; i < teams.length; i++) {
                        let teamDoc = await db.collection('teams').doc(teams[i]).get();
                        let teamObj = teamDoc.data();
                        if (teamObj != undefined) {
                            if (teamObj.teamLeader == req.body.userId)
                                response = true;
                        }
                    }
                    return res.status(200).send({ result: response });
                }
                catch (error) {
                    console.error(error);
                    return res.status(500).send(error);
                }
            }
            else {
                // If user isn't authorized to request this data (isn't logged in)
                return res.status(401).send('Unauthorized');
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// LEAVE TOURNAMENT
router.post('/leavetournament', async (req, res) => {
    (async () => {
        try {
            const correctToken = await authToken_1.authenticateToken(req.body.userId);
            if (correctToken) {
                try {
                    let tournDoc = await db.collection('tournaments').doc(req.body.tournamentId).get();
                    let tournObj = tournDoc.data();
                    // Find the team that needs to be deleted
                    let teams = tournObj.teams;
                    let teamToDelete = '';
                    for (let i = 0; i < teams.length; i++) {
                        let teamDoc = await db.collection('teams').doc(teams[i]).get();
                        let teamObj = teamDoc.data();
                        if (teamObj != undefined) {
                            if (teamObj.teamLeader == req.body.userId) {
                                teamToDelete = teamObj.id;
                                break;
                            }
                        }
                    }
                    // Remove the team from the teams array
                    const index = teams.indexOf(teamToDelete);
                    if (index > -1) {
                        teams.splice(index, 1);
                    }
                    // Insert the result into the database
                    await db.collection('tournaments').doc(req.body.tournamentId).update({
                        teams: teams
                    });
                    await notificationHelper_1.handleNotification('A team left your tournament', 'One of the signed teams left your tournament.', '/tournament/' + req.body.tournamentId, tournObj.organiserId);
                    return res.status(200).send();
                }
                catch (error) {
                    console.error(error);
                    return res.status(500).send(error);
                }
            }
            else {
                // If user isn't authorized to request this data (isn't logged in)
                return res.status(401).send('Unauthorized');
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
/**
 * Give an achievement to all users in a team
 * @param transaction current firestore transaction
 * @param teamId of the team giving achievement to
 * @param achievementId of the achievement
 * @post all member of team with the id <teamId> get the achievement with id <achievementId>
 */
async function giveAchievementToTeam(transaction, team, achievementId) {
    console.debug('Giving achievement to team:', team);
    for (let i = 0; i < team.playerIds.length; ++i) {
        const userId = team.playerIds[i];
        await giveAchievementToUser(transaction, userId, achievementId);
    }
}
/**
 * Gives an achievement to a user
 * @param transaction current firestore transaction
 * @param userId id of user giving to
 * @param achievementId: id of the achievement
 * @post the user with id <userId> gets the achievement with id <achievementId>
 */
async function giveAchievementToUser(transaction, userId, achievementId) {
    console.debug('Giving achievment to user', userId);
    const postId = await userIdGeneration_1.generateUniqueID();
    // postdate
    const postData = {
        postId: postId,
        postDate: Date.now(),
        description: 'Achievement earned:',
        userId: userId,
        achievementIds: [achievementId]
    };
    const userRef = db.collection('users').doc(userId);
    const postRef = db.collection('posts').doc(postId);
    await transaction.update(userRef, {
        achievements: admin.firestore.FieldValue.arrayUnion({
            id: achievementId,
            date: Date.now()
        })
    });
    console.debug('Succesfully added achievement to user');
    await transaction.set(postRef, postData);
    console.debug('Succesfully created post for new user achievement');
}
router.put('/update', (req, res) => {
    (async () => {
        try {
            let body = req.body;
            const correctToken = await authToken_1.authenticateToken(body.userId);
            console.debug('tournamentId:' + body.tournamentId);
            console.debug(body.userId);
            if (!correctToken) {
                return res.status(401).send({ message: 'Unauthorized' });
            }
            let tournamentObject = await getTournamentfromId(body.tournamentId);
            if (tournamentObject.get('hasBegun')) {
                return res.status(400).send({ message: 'Tournament has already begun!' });
            }
            if (body.data.name != '' && body.userId == tournamentObject.get('organiserId')) {
                await updateTournamentName(body.tournamentId, body.data.name);
            }
            if (body.data.description != '' && body.userId == tournamentObject.get('organiserId')) {
                await updateTournamentDescription(body.tournamentId, body.data.description);
            }
            if (body.data.tournamentFormat != '' && body.userId == tournamentObject.get('organiserId')) {
                await updateTournamentFormat(body.tournamentId, body.data.tournamentFormat);
            }
            return res.status(200).send({ message: 'Updated tournament!' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
async function getTournamentfromId(id) {
    let tournament = await db.collection('tournaments').doc(id).get();
    return tournament;
}
async function updateTournamentName(tournamentId, newName) {
    await db.collection('tournaments').doc(tournamentId).update({
        name: newName
    });
}
async function updateTournamentDescription(tournamentId, newDescription) {
    await db.collection('tournaments').doc(tournamentId).update({
        description: newDescription
    });
}
async function updateTournamentFormat(tournamentId, newFormat) {
    await db.collection('tournaments').doc(tournamentId).update({
        format: newFormat
    });
}
async function getUsersFromTournament(tournamentId) {
    let userIds = [];
    let tournDoc = await db.collection('tournaments').doc(tournamentId).get();
    let teams = tournDoc.data().teams;
    for (let i = 0; i < teams.length; i++) {
        let teamDoc = await db.collection('teams').doc(teams[i]).get();
        if (teamDoc.data() != undefined) {
            let teamUserIds = teamDoc.data().playerIds;
            for (let j = 0; j < teamUserIds.length; j++) {
                userIds.push(teamUserIds[j]);
            }
        }
    }
    return userIds;
}
module.exports = router;
//# sourceMappingURL=tournamentRouter.js.map