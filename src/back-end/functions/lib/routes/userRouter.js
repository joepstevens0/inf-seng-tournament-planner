"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authToken_1 = require("../services/authToken");
const notificationHelper_1 = require("../services/notificationHelper");
const userIdGeneration_1 = require("../services/userIdGeneration");
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
const bcrypt = require('bcrypt');
const db = admin.firestore();
/**
 * @author jentevandersanden
 */
/**
 * --------------------------------------
 * 			    USER ROUTES
 * --------------------------------------
 */
// CREATE USER (POST)
router.post('/create', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            let nicknameExists = await checkNicknameExists(userData.nickname);
            let emailExists = await checkEmailExists(userData.email);
            if (nicknameExists) {
                return res.status(403).send({ message: 'Nickname is already taken!' });
            }
            if (emailExists) {
                return res.status(403).send({ message: 'Email is already taken!' });
            }
            // We need to create a unique ID and joinDate at server side
            userData.id = await userIdGeneration_1.generateUniqueID();
            userData.joinDate = await admin.firestore.Timestamp.fromDate(new Date());
            // Password encryption
            const hashedPassw = await bcrypt.hash(userData.password, 10);
            // Overwrite the plain text password with the hashed password
            userData.password = hashedPassw;
            // insert into firestore
            await db.collection('users').doc('/' + userData.id + '/').set(userData).then(() => {
                console.debug('User Successfully Created!');
            });
            await notificationHelper_1.handleNotification('Welcome To PlayConnect!', 'Welcome to this platform, enjoy your time on here!', '/profile/' + userData.nickname, [userData.id]);
            return res.status(200).send({ message: 'You are now registered!' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
// GET ALL USERS
router.get('/read', async (req, res) => {
    try {
        const userDoc = await db.collection('users');
        const users = await userDoc.get();
        return res.status(200).send(users.docs.map((doc) => {
            const userData = doc.data();
            userData.password = '';
            return userData;
        }));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// GET USER BY ID
router.get('/read/:id', (req, res) => {
    (async () => {
        try {
            let userDoc = await db.collection('users').doc(req.params.id).get();
            const userData = userDoc.data();
            userData.password = '';
            return res.status(200).send(JSON.stringify(userData));
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// GET USER BY NICKNAME
router.get('/readnick/:nickname', (req, res) => {
    (async () => {
        try {
            let foundDocs = [];
            await db
                .collection('users')
                .where('nickname', '==', req.params.nickname)
                .get()
                .then((querySnapshot) => {
                querySnapshot.forEach((element) => {
                    foundDocs.push(element);
                });
            });
            if (foundDocs.length == 0)
                return res.status(404).send('User Not Found');
            const userData = foundDocs[0].data();
            userData.password = '';
            return res.status(200).send(JSON.stringify(userData));
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
/**
 * Updates email, nickname and/or bio of a user
 * The fields that need to be changed are given under the argument 'data' in the body of the request.
 * The route also checks wether a email or nickname is already taken and handles these situations.
 */
router.put('/update', (req, res) => {
    (async () => {
        try {
            let body = req.body;
            const correctToken = await authToken_1.authenticateToken(body.userId);
            if (!correctToken) {
                return res.status(401).send({ message: 'Unauthorized' });
            }
            let userObject = await getUserfromId(body.userId);
            let nicknameExists = await checkNicknameExists(body.data.nickname);
            let emailExists = await checkEmailExists(body.data.email);
            if (body.data.email != '' && body.data.email != userObject.get('email') && !emailExists) {
                await updateEmail(body.userId, body.data.email);
            }
            else if (emailExists || body.data.email == userObject.get('email')) {
                return res.status(403).send({ message: 'Email already in use!' });
            }
            if (body.data.nickname != '' && body.data.nickname != userObject.get('nickname') && !nicknameExists) {
                await updateNickname(body.userId, body.data.nickname);
            }
            else if (nicknameExists || body.data.mickname == userObject.get('nickname')) {
                return res.status(403).send({ message: 'Nickname already in use!' });
            }
            if (body.data.bio != '') {
                await updateBio(body.userId, body.data.bio);
            }
            return res.status(200).send({ message: 'Updated account!' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
/**
 * Updates the password of a user
 * The oldpassword, newpassword and confirmpassword are given under the argument 'data' in the body of the request.
 * The route also checks wether the oldpassword was valid and handles the case where it wasn't.
 */
router.put('/updatepassword', (req, res) => {
    (async () => {
        try {
            let body = req.body;
            const correctToken = await authToken_1.authenticateToken(body.userId);
            if (!correctToken) {
                return res.status(401).send({ message: 'Unauthorized' });
            }
            try {
                let userObject = await getUserfromId(body.userId);
                if (await bcrypt.compare(body.data.oldpassword, userObject.get('password'))) {
                    if (body.data.newpassword === body.data.confirmedpassword) {
                        const hashedPassw = await bcrypt.hash(body.data.newpassword, 10);
                        updatePassword(body.userId, hashedPassw);
                        return res.status(200).send({ message: 'Updated password!' });
                    }
                    return res.status(400).send({ message: "Given passwords don't match" });
                }
                else {
                    return res.status(400).send({ message: 'Old password was incorrect!' });
                }
            }
            catch (error) {
                return res.status(500).send({ message: 'Error while decrypting password in password update endpoint' });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// BAN USER
router.put('/ban', async (req, res) => {
    try {
        const adminId = req.body.adminId;
        const userId = req.body.userId;
        const correctToken = await authToken_1.authenticateAdminToken(adminId);
        if (!correctToken) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const userRef = db.collection('users').doc(userId);
        await userRef.update({ isBanned: true });
        return res.status(200).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// UNBAN USER
router.put('/unban', async (req, res) => {
    try {
        const adminId = req.body.adminId;
        const userId = req.body.userId;
        const correctToken = await authToken_1.authenticateAdminToken(adminId);
        if (!correctToken) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const userRef = db.collection('users').doc(userId);
        await userRef.update({ isBanned: false });
        return res.status(200).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// VERIFY USER
router.put('/verify', async (req, res) => {
    try {
        const adminId = req.body.adminId;
        const userId = req.body.userId;
        const correctToken = await authToken_1.authenticateAdminToken(adminId);
        if (!correctToken) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const userRef = db.collection('users').doc(userId);
        await userRef.update({ isVerified: true });
        await notificationHelper_1.handleNotification('You are now verified!', 'You are now a verified user on this platform! You now belong to the top content creators!', '/profile/' + userRef.get('nickname'), [userRef.get('id')]);
        return res.status(200).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
// UNVERIFY USER
router.put('/unverify', async (req, res) => {
    try {
        const adminId = req.body.adminId;
        const userId = req.body.userId;
        const correctToken = await authToken_1.authenticateAdminToken(adminId);
        if (!correctToken) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const userRef = db.collection('users').doc(userId);
        await userRef.update({ isVerified: false });
        return res.status(200).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
/**
 * Checks if a user with a certain nickname already exists in the database
 * @param nickname The nickname you're looking for
 * @returns `boolean`
 */
async function checkNicknameExists(nickname) {
    let userMatches = [];
    // Check if there's an existing user with this nickname
    await db
        .collection('users')
        .where('nickname', '==', nickname)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            userMatches.push(doc.data());
        });
    });
    if (userMatches.length == 1) {
        return true;
    }
    return false;
}
/**
 * Checks if a user with a certain email already exists in the database
 * @param email : The email you're looking for
 * @returns `boolean`
 */
async function checkEmailExists(email) {
    let userMatches = [];
    // Check if there's an existing user with this email
    await db.collection('users').where('email', '==', email).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            userMatches.push(doc.data());
        });
    });
    if (userMatches.length == 1) {
        return true;
    }
    return false;
}
/**
 * Updates the email of a given user to the new value
 * @param userId The id of the user
 * @param newEmail The new value for the email of the user
 */
async function updateEmail(userId, newEmail) {
    await db.collection('users').doc(userId).update({
        email: newEmail
    });
}
/**
 * Updates the nickname of a given user to the new value
 * @param userId The id of the user
 * @param newNickname The new value for the nickname of the user
 */
async function updateNickname(userId, newNickname) {
    await db.collection('users').doc(userId).update({
        nickname: newNickname
    });
}
/**
 * Updates the bio of a given user to the new value
 * @param userId The id of the user
 * @param newBio The new value for the bio f the user
 */
async function updateBio(userId, newBio) {
    await db.collection('users').doc(userId).update({
        bio: newBio
    });
}
/**
 * Gets the user from the database with the given id
 * @param id id of user to get
 * @returns User object with corresponding id to requested id
 */
async function getUserfromId(id) {
    let user = await db.collection('users').doc(id).get();
    return user;
}
/**
 * Updates the password of a given user to the new value
 * @param userId The id of the user
 * @param newPassword The new value for the password of the user
 */
async function updatePassword(userId, newPassword) {
    await db.collection('users').doc(userId).update({
        password: newPassword
    });
}
// Gets all the users a user has or can chat with
// This includes all chats that exist of this user + all his friends
router.post('/readallchatusers', async (req, res) => {
    (async () => {
        try {
            let userData = req.body;
            if (userData.userId === '') {
                return res.status(500).send({});
            }
            let loggedUser = await getUserfromId(userData.userId);
            let result = await getFriends(loggedUser);
            let result2 = await addOtherChatUsers(loggedUser, result);
            result.concat(result2);
            return res.status(200).send(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({ message: error });
        }
    })();
});
async function addOtherChatUsers(user, result) {
    let chatMatches = [];
    // Check if there's an existing user with this nickname
    await db
        .collection('chats')
        .where('usage', '==', 'p2p')
        .where('users', 'array-contains', user.get('id'))
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            chatMatches.push(doc);
        });
    });
    for (let i = 0; i < chatMatches.length; i++) {
        if (chatMatches[i].get('users')[0] == user.get('id') && !isDuplicate(chatMatches[i].get('users')[1], result)) {
            let tempUser = await getUserfromId(chatMatches[i].get('users')[1]);
            const userData = tempUser.data();
            userData.password = '';
            result.push(userData);
        }
        if (chatMatches[i].get('users')[1] == user.get('id') && !isDuplicate(chatMatches[i].get('users')[0], result)) {
            let tempUser = await getUserfromId(chatMatches[i].get('users')[0]);
            const userData = tempUser.data();
            userData.password = '';
            result.push(userData);
        }
    }
    return result;
}
function isDuplicate(id, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return true;
        }
    }
    return false;
}
async function getFriends(loggedUser) {
    let result = [];
    for (let i = 0; i < loggedUser.get('following').length; i++) {
        let tempUser = await getUserfromId(loggedUser.get('following')[i]);
        if (loggedUser.get('following').includes(tempUser.get('id')) &&
            tempUser.get('following').includes(loggedUser.get('id')) &&
            loggedUser.get('followers').includes(tempUser.get('id')) &&
            tempUser.get('followers').includes(loggedUser.get('id'))) {
            const userData = tempUser.data();
            userData.password = '';
            result.push(userData);
        }
    }
    return result;
}
module.exports = router;
//# sourceMappingURL=userRouter.js.map