"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
const userIdGeneration_1 = require("../services/userIdGeneration");
const authToken_1 = require("../services/authToken");
const db = admin.firestore();
/**
 * --------------------------------------
 * 			    CHAT ROUTES
 * --------------------------------------
 */
// get ID of person to person chat
router.get('/p2pid/:id1/:id2', async (req, res) => {
    try {
        // authenticate user
        const correctToken = await authToken_1.authenticateToken(req.params.id1);
        if (!correctToken)
            return res.status(401).send('Unauthorized');
        // get chat from id1
        const chat1Ref = db.collection('chats').where("usage", "==", "p2p")
            .where("users", "array-contains", req.params.id1);
        const chat1Docs = await chat1Ref.get();
        // get chats from id2
        const chat2Ref = db.collection('chats').where("usage", "==", "p2p")
            .where("users", "array-contains", req.params.id2);
        const chat2Docs = await chat2Ref.get();
        // find matching doc
        let chatId = null;
        let i = 0;
        while (chatId == null && i < chat1Docs.docs.length) {
            let j = 0;
            while (chatId == null && j < chat2Docs.docs.length) {
                if (chat1Docs.docs[i].id == chat2Docs.docs[j].id)
                    chatId = chat1Docs.docs[i].id;
                ++j;
            }
            ++i;
        }
        // create new chat if chat doet not exist
        if (chatId === null) {
            chatId = await userIdGeneration_1.generateUniqueID();
            const chatDoc = db.collection('chats').doc(chatId);
            await chatDoc.set({
                users: [req.params.id1, req.params.id2],
                usage: "p2p"
            });
            console.log('Chat Successfully Created!');
        }
        return res.status(200).send(chatId);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
    ;
});
// CREATE CHAT MESSAGE
router.post('/create/:id', (req, res) => {
    (async () => {
        try {
            let messageData = req.body;
            // authenticate user
            const correctToken = await authToken_1.authenticateToken(messageData.senderId);
            if (!correctToken)
                return res.status(401).send('Unauthorized');
            // test if user in chat
            const chatDoc = await db.collection('chats').doc(req.params.id).get();
            const chatData = chatDoc.data();
            if (chatData !== undefined && chatData.users !== undefined && chatData.users.indexOf(messageData.senderId) == -1)
                return res.status(401).send('Unauthorized');
            // Check if the send message is empty
            if (messageData.message.length <= 0)
                return res.status(400).send('Empty message');
            // create a unique ID
            const id = await userIdGeneration_1.generateUniqueID();
            // insert into firestore
            await db
                .collection('chats')
                .doc(req.params.id)
                .collection('messages')
                .doc('/' + id + '/')
                .set(messageData)
                .then(() => {
                console.debug('Message Successfully Created for chatId:', req.params.id);
            });
            return res.status(200).send();
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});
// GET CHAT MESSAGES
router.get('/read/:id/:userId', async (req, res) => {
    console.debug('Debug: /read/' + req.params.id);
    try {
        const userId = req.params.userId;
        // authenticate user
        const correctToken = await authToken_1.authenticateToken(userId);
        if (!correctToken)
            return res.status(401).send('Unauthorized');
        // test if user in chat
        const chatDoc = await db.collection('chats').doc(req.params.id).get();
        const chatData = chatDoc.data();
        if (chatData !== undefined && chatData.users !== undefined && chatData.users.indexOf(userId) == -1)
            return res.status(401).send('Unauthorized');
        const messageDocs = await db
            .collection('chats')
            .doc(req.params.id)
            .collection('messages')
            .orderBy('time')
            .get();
        return res.status(200).send(messageDocs.docs.map((doc) => doc.data()));
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
        return;
    }
});
// SUBSCRIBE TO A CHAT
router.get('/subscribe/:id/:userId', async (req, res) => {
    console.debug('Debug: /subscribe/' + req.params.id);
    try {
        const userId = req.params.userId;
        // authenticate user
        const correctToken = await authToken_1.authenticateToken(userId);
        if (!correctToken)
            return res.status(401).send('Unauthorized');
        // test if user in chat
        const chatDoc = await db.collection('chats').doc(req.params.id).get();
        const chatData = chatDoc.data();
        if (chatData !== undefined && chatData.users !== undefined && chatData.users.indexOf(userId) == -1)
            return res.status(401).send('Unauthorized');
        // write headers
        const headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        };
        res.writeHead(200, headers);
        const unsubscribe = await subscribeChat(res, req.params.id);
        const closeConnection = () => {
            console.debug('Client unsubscribed from chat (id=' + req.params.id + ')');
            unsubscribe();
            res.end();
        };
        // If client closes connection, unsubscribe from snapshot
        res.on('close', closeConnection);
        // close connection after 55 because of firestore timeout
        setTimeout(closeConnection, 55000);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
        return;
    }
});
/**
 * Sends a chat message to the client
 * @param res : router response
 * @param data : the message data
 */
function sendMessageToClient(res, data) {
    // send messages to client
    res.write('data: ');
    res.write(JSON.stringify(data));
    res.write('\n\n');
    res.end();
}
/**
 * Subscribes a client to a chat, returns the unsubscribe function which can be used to unsubscribe
 * from the chat. Once the client is subscribed, they will receive messages posted in that chat from
 * that point in time.
 * @param res : router response
 * @param id : The ID of the chat to subscribe to
 * @returns Function to unsubscribe
 */
async function subscribeChat(res, id) {
    console.debug('New client subscribed to chat (id=' + id + ')');
    const messageCollection = await db
        .collection('chats')
        .doc(id)
        .collection('messages')
        .where('time', '>', Date.now())
        .orderBy('time');
    const unsubscribe = await messageCollection.onSnapshot((querysnapshot) => {
        const newMessages = [];
        querysnapshot.docChanges().forEach((element) => {
            if (element.type == 'added')
                newMessages.push(element.doc.data());
        });
        // send messages to client
        if (newMessages.length > 0)
            sendMessageToClient(res, newMessages);
    }, function (error) {
        console.error('Chat (id=' + id + ') subscription error:', error);
    });
    return unsubscribe;
}
module.exports = router;
//# sourceMappingURL=chatRouter.js.map