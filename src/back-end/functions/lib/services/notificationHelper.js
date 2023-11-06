"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotification = void 0;
// import { Request, Response } from 'express';
const firebase_admin_1 = require("firebase-admin");
// const express = require('express');
const admin = require('firebase-admin');
// let router = express.Router();
const db = admin.firestore();
const userIdGeneration_1 = require("./userIdGeneration");
/**
 *
 * @param notificationName : Name of the notification
 * @param notificationDescription : Description of the notification
 * @param notificationLink : Profile to redirect to when clicked on the notification
 * @returns `string` Id of the notification
 */
async function createNotification(notificationName, notificationDescription, notificationLink) {
    try {
        let notificationData = {
            id: '',
            name: notificationName,
            description: notificationDescription,
            link: notificationLink,
        };
        notificationData.id = await userIdGeneration_1.generateUniqueID();
        // insert into firestore
        await db.collection('notifications').doc(notificationData.id).set(notificationData).then(() => {
            console.log('Notification Created!');
        });
        return notificationData.id;
    }
    catch (error) {
        console.log(`Error in authenticateToken: ${error}`);
        return '';
    }
}
/**
 *
 * @param notificationId Id of notification
 * @param userIds Id of users to send the notification to
 * @post NotificationId is added to the id's for received notifications for the user
 */
async function sendNotification(notificationId, userIds) {
    try {
        for (let i = 0; i < userIds.length; i++) {
            const userRef = db.collection('users').doc(userIds[i]);
            await userRef.update({
                notifications: firebase_admin_1.firestore.FieldValue.arrayUnion(notificationId)
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}
/**
 *
 * @param notificationName : Name of the notification
 * @param notificationDescription : Description of the notification
 * @param notificationLink : Link to redirect to when clicked
 * @param userIds : UserId's to send notifications to.
 */
async function handleNotification(notificationName, notificationDescription, notificationLink, userIds) {
    try {
        let notificationId = await createNotification(notificationName, notificationDescription, notificationLink);
        await sendNotification(notificationId, userIds);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleNotification = handleNotification;
//# sourceMappingURL=notificationHelper.js.map