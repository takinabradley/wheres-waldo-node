import config from "dotenv/config"
import mongoose from "mongoose"
import Character from "./models/Character.js"

mongoose
  .connect(process.env.MONGO_DB_TEST_URI || process.env.MONGO_DB_URI || "")
  .then(() => console.log("mongoose connected:\n"))
  .catch(() => console.log("mongoose failed to connect:\n"))

// TODO - populate DB with characters
const characters = [
  {
    name: "King Pig",
    pos: [35, 20],
    imgUrl: "/kingpig.png",
  },
  {
    name: "Ghosty",
    pos: [88, 71],
    imgUrl: "/ghosty.png",
  },
  {
    name: "Mouse Pig",
    pos: [24, 71],
    imgUrl: "/pigmouse.png",
  },
]

characters.forEach(async (character) => {
  await Character.create({ name: character.name, pos: character.pos })
  console.log("character created")
})
