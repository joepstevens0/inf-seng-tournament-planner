const functions = require("firebase-functions");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
import { initFirebase } from "./firebase/init";
initFirebase(); // Initialize Firebase app emulation
const userRouter = require("./routes/userRouter");
const tournamentRouter = require("./routes/tournamentRouter");
const lobbyRouter = require("./routes/lobbyRouter");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const gameRouter = require("./routes/gameRouter");
const teamRouter = require("./routes/teamRouter");
const achievementRouter = require("./routes/achievementRouter");
const followerRouter = require("./routes/followerRouter");
const notificationRouter = require("./routes/notificationRouter");
import { Response, Request, NextFunction } from "express";

/**
 * @author jentevandersanden
 * This is the index file of the back-end server application.
 * This is a serverless API that runs on a firebase functions emulator
 * instance .
 */

// CORS (Cross origin resource sharing)
app.use(cors());

// App middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// use JSON
app.use(express.json());

// Routes
app.use("/auth/user", authRouter);
app.use("/api/user", userRouter);
app.use("/api/tournament", tournamentRouter);
app.use("/api/lobby", lobbyRouter);
app.use("/api/posts", postRouter);
app.use("/api/chat", chatRouter);
app.use("/api/game", gameRouter);
app.use("/api/team", teamRouter);
app.use("/api/achievement", achievementRouter);
app.use("/api/follower", followerRouter);
app.use("/api/notification", notificationRouter);

// app.listen(process.env.RUNNING_PORT);

exports.app = functions.https.onRequest(app);
