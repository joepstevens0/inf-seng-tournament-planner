"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authToken_1 = require("../services/authToken");
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
const userIdGeneration_1 = require("../services/userIdGeneration");
const db = admin.firestore();
/**
 * --------------------------------------
 * 			    POST ROUTES
 * --------------------------------------
 */
// CREATE POST
router.post('/create', async (req, res) => {
    try {
        let postData = req.body;
        const correctToken = await authToken_1.authenticateToken(postData.userId);
        if (!correctToken)
            return res.status(401).send('Unauthorized');
        postData.postId = await userIdGeneration_1.generateUniqueID();
        postData.postDate = Date.now();
        // insert into firestore
        await db.collection('posts').doc(postData.postId).set(postData).then(() => {
            console.debug('Post Successfully Created!');
        });
        return res.status(200).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// READ POST
router.get('/readByUser/:userId', async (req, res) => {
    try {
        const postRef = db.collection('posts').where("userId", "==", req.params.userId);
        const postDocs = await postRef.get();
        return res.status(200).send(postDocs.docs.map((doc) => doc.data()));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
module.exports = router;
//# sourceMappingURL=postRouter.js.map