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

app.get("/message", (_, res) => res.send("Hello from express!!!"))

ViteExpress.config({ viteConfigFile })
ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))
