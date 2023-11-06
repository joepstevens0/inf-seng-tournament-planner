"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = require("firebase-admin");
const authToken_1 = require("../services/authToken");
const notificationHelper_1 = require("../services/notificationHelper");
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
const db = admin.firestore();
// Checks if first user follows the second
router.post('/read', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            if (userData.firstName === '' || userData.secondName === '') {
                return res.status(500).send({});
            }
            let firstUser = await getUser(userData.firstName);
            let secondUser = await getUser(userData.secondName);
            if (firstUser.length > 0 && secondUser.length > 0) {
                if (firstUser[0].get('following').includes(secondUser[0].get('id'))
                    && secondUser[0].get('followers').includes(firstUser[0].get('id'))) {
                    return res.status(200).send({ message: true });
                }
                else {
                    return res.status(200).send({ message: false });
                }
            }
            return res.status(500).send({});
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
        // return res.status(500).send({});
    })();
});
// This function updates the follow of a user a on user b
// If a follows b already, a will have unfollowed b
// If a doesn't follow b yet, he will now follow b
router.put('/update', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            if (userData.firstName === undefined || userData.secondName === undefined) {
                return res.status(500).send();
            }
            let firstUser = await getUser(userData.firstName);
            let secondUser = await getUser(userData.secondName);
            const correctToken = await authToken_1.authenticateToken(firstUser[0].id);
            if (!correctToken)
                return res.status(401).send('Unauthorized');
            if (firstUser.length > 0 && secondUser.length > 0) {
                if (firstUser[0].get('following').includes(secondUser[0].get('id'))
                    && secondUser[0].get('followers').includes(firstUser[0].get('id'))) {
                    // unfollow
                    await unfollowUser(firstUser[0].get('id'), secondUser[0].get('id'));
                    await notificationHelper_1.handleNotification(firstUser[0].get('nickname') + ' unfollowed', firstUser[0].get('nickname') + ' unfollowed you!', '/profile/' + firstUser[0].get('nickname'), [secondUser[0].get('id')]);
                    return res.status(200).send('ok');
                }
                else {
                    // follow
                    await followUser(firstUser[0].get('id'), secondUser[0].get('id'));
                    await notificationHelper_1.handleNotification(firstUser[0].get('nickname') + ' followed', firstUser[0].get('nickname') + ' followed you!', '/profile/' + firstUser[0].get('nickname'), [secondUser[0].get('id')]);
                    return res.status(200).send('ok');
                }
            }
            return res.status(500).send();
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// Checks if first user follows the second, visa versa: this implies friendship
router.post('/readfriend', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            if (userData.firstName === '' || userData.secondName === '') {
                return res.status(500).send({});
            }
            let firstUser = await getUser(userData.firstName);
            let secondUser = await getUser(userData.secondName);
            if (firstUser.length > 0 && secondUser.length > 0) {
                if (firstUser[0].get('following').includes(secondUser[0].get('id'))
                    && secondUser[0].get('following').includes(firstUser[0].get('id'))
                    && firstUser[0].get('followers').includes(secondUser[0].get('id'))
                    && secondUser[0].get('followers').includes(firstUser[0].get('id'))) {
                    return res.status(200).send({ message: true });
                }
                else {
                    return res.status(200).send({ message: false });
                }
            }
            return res.status(500).send({});
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
// Gets all friends of a given user
router.post('/readallfriends', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            if (userData.userId === '') {
                return res.status(500).send({});
            }
            let firstUser = await getUserfromId(userData.userId);
            let result = [];
            for (let i = 0; i < firstUser[0].get('following').length; i++) {
                let tempUser = await getUserfromId(firstUser[0].get('following')[i]);
                if (firstUser[0].get('following').includes(tempUser[0].get('id'))
                    && tempUser[0].get('following').includes(firstUser[0].get('id'))
                    && firstUser[0].get('followers').includes(tempUser[0].get('id'))
                    && tempUser[0].get('followers').includes(firstUser[0].get('id'))) {
                    const userData = tempUser[0].data();
                    userData.password = "";
                    result.push(userData);
                }
            }
            return res.status(200).send(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
// Gets all followers of a given user
router.post('/readfollowers', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            if (userData.userId === '') {
                return res.status(500).send({});
            }
            let firstUser = await getUserfromId(userData.userId);
            let result = [];
            for (let i = 0; i < firstUser[0].get('followers').length; i++) {
                let tempUser = await getUserfromId(firstUser[0].get('followers')[i]);
                if (tempUser[0].get('following').includes(firstUser[0].get('id'))
                    && firstUser[0].get('followers').includes(tempUser[0].get('id'))) {
                    const userData = tempUser[0].data();
                    userData.password = "";
                    result.push(userData);
                }
            }
            return res.status(200).send(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
// Gets all user the given user follows
router.post('/readfollowing', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            if (userData.userId === '') {
                return res.status(500).send({});
            }
            let firstUser = await getUserfromId(userData.userId);
            let result = [];
            for (let i = 0; i < firstUser[0].get('following').length; i++) {
                let tempUser = await getUserfromId(firstUser[0].get('following')[i]);
                if (firstUser[0].get('following').includes(tempUser[0].get('id'))
                    && tempUser[0].get('followers').includes(firstUser[0].get('id'))) {
                    const userData = tempUser[0].data();
                    userData.password = "";
                    result.push(userData);
                }
            }
            return res.status(200).send(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
/**
 * --------------------------------------
 * 			    FOLLOWER ROUTES
 * --------------------------------------
 */
/**
 *
 * @param UserID User id of user to be set verified
 */
async function setUserVerified(UserID) {
    await db
        .collection('users')
        .doc(UserID)
        .update({
        isVerified: true
    });
}
/**
 *
 * @param userID User id of user to be checked
 */
async function checkUserVerified(userID) {
    let user = [];
    await db
        .collection('users')
        .where('id', '==', userID)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
            user.push(element);
        });
    });
    if (user.length === 1) {
        if (user[0].get('followers').length === 1000) {
            setUserVerified(userID);
        }
    }
}
/**
 *
 * @param id id of user to get
 * @returns User object with corresponding id to requested id
 */
async function getUserfromId(id) {
    let user = [];
    await db
        .collection('users')
        .where('id', '==', id)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
            user.push(element);
        });
    });
    return user;
}
/**
 *
 * @param name Name of user to get
 * @returns User Object with name equal to requested name
 */
async function getUser(name) {
    let user = [];
    await db
        .collection('users')
        .where('nickname', '==', name)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
            user.push(element);
        });
    });
    return user;
}
//user1 unfollows user2
async function unfollowUser(user1Id, user2Id) {
    await db
        .collection('users')
        .doc(user1Id)
        .update({
        following: firebase_admin_1.firestore.FieldValue.arrayRemove(user2Id)
    });
    await db
        .collection('users')
        .doc(user2Id)
        .update({
        followers: firebase_admin_1.firestore.FieldValue.arrayRemove(user1Id)
    });
}
//user1 follows user2
async function followUser(user1Id, user2Id) {
    await db
        .collection('users')
        .doc(user1Id)
        .update({
        following: firebase_admin_1.firestore.FieldValue.arrayUnion(user2Id)
    });
    await db
        .collection('users')
        .doc(user2Id)
        .update({
        followers: firebase_admin_1.firestore.FieldValue.arrayUnion(user1Id)
    });
    checkUserVerified(user2Id);
}
module.exports = router;
//# sourceMappingURL=followerRouter.js.map