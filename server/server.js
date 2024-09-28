// e.g server.js
import "dotenv/config"
import express from "express"
import path from "node:path"
import mongoose from "mongoose"
import debug from "debug"
import { rateLimit } from "express-rate-limit"
import MongoStore from "rate-limit-mongo"
import helmet from "helmet"
import ViteExpress from "vite-express"
// const cors = require("cors");
import process from "node:process"
import session from "express-session"

import Character from "./models/Character.js"

const appDebug = debug("wheres-waldo:app")
const viteConfigFile = path.resolve(import.meta.dirname, "../vite.config.js")

if (process.env.NODE_ENV === "production") debug.disable()

mongoose
  .connect(process.env.MONGO_DB_TEST_URI || process.env.MONGO_DB_URI || "")
  .then(() => appDebug("mongoose connected:\n"))
  .catch(() => appDebug("mongoose failed to connect:\n"))

const app = express()

app.use(
  session({
    name: "wheres-waldo",
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: true,
      secure:
        // production should be use the secure option
        // the environment variable USE_HTTP can be set to override this for
        // testing production builds
        process.env.NODE_ENV === "production" &&
        process.env.USE_HTTP !== "true",
    },
    resave: false,
    saveUninitialized: false,
  })
)

app.use(express.json())

app.get("/animals.jpg", (req, res, next) => {
  // start the game as soon as the image is loaded
  // reset any session data to restart the game
  session.startTime = Date.now()
  session.endTime = undefined
  session.foundCharacters = []
  next()
})

const apiRouter = express.Router()

apiRouter.post("/seek-and-find/characters", async (req, res, next) => {
  // if endTime has been calculated already, just send that. Game is over.
  if (session.endTime)
    return res.json({ endTime: session.endTime - session.startTime })

  const allCharacters = await Character.find()

  const character = await Character.findOne({
    "pos.0": { $gte: req.body?.percentX - 5, $lte: req.body?.percentX + 5 },
    "pos.1": { $gte: req.body?.percentY - 5, $lte: req.body?.percentY + 5 },
  })

  // if a character is found, add it to the list of found characters this session
  if (character && !session.foundCharacters.includes(character._id.toString()))
    session.foundCharacters.push(character._id.toString())

  // if all characters are found, set the end time
  if (
    allCharacters.every((character) =>
      session.foundCharacters.includes(character._id.toString())
    )
  ) {
    session.endTime = Date.now()
  }

  // send back the character and the endtime
  // The endtime and last character are generally found at the same time
  return res.json({
    character,
    endTime: session.endTime ? session.endTime - session.startTime : null,
  })
})

apiRouter.get("/seek-and-find/characters", async (req, res, next) => {
  const characters = await Character.find({}, "name imgUrl")
  res.json(characters)
})

app.use("/api", apiRouter)

ViteExpress.config({ viteConfigFile })
ViteExpress.listen(app, 3000, () =>
  console.log("Server listening at http://localhost:3000")
)
