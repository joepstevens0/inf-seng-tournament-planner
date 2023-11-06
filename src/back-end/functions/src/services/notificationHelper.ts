// import { Request, Response } from 'express';
import { firestore } from 'firebase-admin';
// const express = require('express');
const admin = require('firebase-admin');
// let router = express.Router();
const db = admin.firestore();
import { generateUniqueID } from "./userIdGeneration";



/**
 * 
 * @param notificationName : Name of the notification
 * @param notificationDescription : Description of the notification
 * @param notificationLink : Profile to redirect to when clicked on the notification
 * @returns `string` Id of the notification
 */
async function createNotification(notificationName: string, notificationDescription: string, notificationLink: string) {
    try {
        let notificationData = {
            id: '',
            name: notificationName,
            description: notificationDescription,
            link: notificationLink,
        };
        notificationData.id = await generateUniqueID();

        // insert into firestore
        await db.collection('notifications').doc(notificationData.id).set(notificationData).then(() => {
            console.log('Notification Created!');
        });
        return notificationData.id;
    } catch (error) {
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
async function sendNotification(notificationId: string, userIds: String[]) {
    try {
        for (let i = 0; i < userIds.length; i++) {
            const userRef = db.collection('users').doc(userIds[i]);
            await userRef.update({
                notifications: firestore.FieldValue.arrayUnion(notificationId)
            });
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * 
 * @param notificationName : Name of the notification
 * @param notificationDescription : Description of the notification
 * @param notificationLink : Link to redirect to when clicked
 * @param userIds : UserId's to send notifications to.
 */
export async function handleNotification(notificationName: string, notificationDescription: string, notificationLink: string, userIds: string[]){
    try{
        let notificationId = await createNotification(notificationName, notificationDescription, notificationLink);
        await sendNotification(notificationId, userIds);
    } catch (error){
        console.log(error);
    }
}