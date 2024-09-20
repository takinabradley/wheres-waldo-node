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

const appDebug = debug("wheres-waldo:app")
const viteConfigFile = path.resolve(import.meta.dirname, "../vite.config.js")

if (process.env.NODE_ENV === "production") debug.disable()

mongoose
  .connect(process.env.MONGO_DB_TEST_URI || process.env.MONGO_DB_URI || "")
  .then(() => appDebug("mongoose connected:\n"))
  .catch(() => appDebug("mongoose failed to connect:\n"))

const app = express()

app.get("/message", (_, res) => res.send("Hello from express!!!"))

ViteExpress.config({ viteConfigFile })
ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))
