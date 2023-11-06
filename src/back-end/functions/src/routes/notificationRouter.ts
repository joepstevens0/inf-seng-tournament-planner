import { Request, Response } from 'express';
import { firestore } from 'firebase-admin';
import { authenticateToken } from '../services/authToken';
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
const db = admin.firestore();


/**
 * --------------------------------------
 * 			    NOTIFICATION ROUTES
 * --------------------------------------
 */

async function getNotificationfromId(id: string): Promise<firestore.DocumentSnapshot> {
    let notification = await db
        .collection('notifications')
        .doc(id)
        .get()
    return notification
}

async function getLastNotifications(user: firestore.DocumentSnapshot) {
    try {
        let result = [];
        for (let j = 0, i = user.get('notifications').length -1; (j < 25) && (i >= 0); i--, j++) {
            let tempNotification = await getNotificationfromId(user.get('notifications')[i])
            result.push(tempNotification.data());
        }
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}


// READ LAST 25 NOTIFICATIONS
router.post('/read', async (req: Request, res: Response) => {
    (async () => {
        try {
            const correctToken = await authenticateToken(req.body.userId);
            if (correctToken) {
                let user = await db.collection('users').doc(req.body.userId).get();
                let result = await getLastNotifications(user)
                return res.status(200).send(result);
            }
            return res.status(401).send();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })()

});


module.exports = router;