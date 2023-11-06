"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authToken_1 = require("../services/authToken");
const notificationHelper_1 = require("../services/notificationHelper");
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
const userIdGeneration_1 = require("../services/userIdGeneration");
const db = admin.firestore();
/**
 * --------------------------------------
 * 			    ACHIEVEMENT ROUTES
 * --------------------------------------
 */
// CREATE ACHIEVEMENT
router.post('/create', async (req, res) => {
    try {
        let achievementData = req.body.achievement;
        const correctToken = await authToken_1.authenticateAdminToken(req.body.userId);
        if (!correctToken)
            return res.status(401).send('Unauthorized');
        achievementData.id = await userIdGeneration_1.generateUniqueID();
        // insert into firestore
        await db.collection('achievements').doc(achievementData.id).set(achievementData).then(() => {
            console.debug('Achievement Successfully Created!');
        });
        return res.status(200).send(achievementData);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// READ ACHIEVEMENT
router.get('/read/:achievementId', async (req, res) => {
    try {
        const achievementRef = db.collection('achievements').doc(req.params.achievementId);
        const achievementDoc = await achievementRef.get();
        return res.status(200).send(achievementDoc.data());
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// DELETE ACHIEVEMENT
router.delete('/delete/:achievementId', async (req, res) => {
    try {
        const correctToken = await authToken_1.authenticateAdminToken(req.body.userId);
        if (!correctToken)
            return res.status(401).send('Unauthorized');
        const achievementRef = db.collection('achievements').doc(req.params.achievementId);
        await achievementRef.delete();
        console.debug("Succesfully deleted achievement");
        return res.status(200).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// GIVE ACHIEVEMENT
router.put('/giveToUser', async (req, res) => {
    try {
        const correctToken = await authToken_1.authenticateAdminToken(req.body.currentUserId);
        if (!correctToken)
            return res.status(401).send('Unauthorized');
        const userId = req.body.userId;
        const achievementId = req.body.achievementId;
        const date = req.body.date;
        const postId = await userIdGeneration_1.generateUniqueID();
        // postdate
        const postData = {
            "postId": postId,
            "postDate": date,
            "description": "Achievement earned:",
            "userId": userId,
            "achievementIds": [achievementId]
        };
        const userRef = db.collection('users').doc(userId);
        const postRef = db.collection('posts').doc(postId);
        await db.runTransaction(async (transaction) => {
            await transaction.update(userRef, { achievements: admin.firestore.FieldValue.arrayUnion({ "id": achievementId, "date": date }) });
            await notificationHelper_1.handleNotification('Earned new achievement', 'You just earned a new achievement, go check it out!', '/achievements/' + userRef.get('nickname'), [userRef.get('id')]);
            console.debug("Succesfully added achievement to user");
            await transaction.set(postRef, postData);
            console.debug("Succesfully created post for new user achievement");
        });
        return res.status(200).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
module.exports = router;
//# sourceMappingURL=achievementRouter.js.map