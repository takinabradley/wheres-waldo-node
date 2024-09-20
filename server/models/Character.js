const mongoose = require("mongoose")

const characterSchema = mongoose.Schema({
  name: String,
})

const Character = mongoose.model(characterSchema)

module.exports = Character
