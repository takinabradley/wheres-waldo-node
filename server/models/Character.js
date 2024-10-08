import mongoose from "mongoose"

const characterSchema = mongoose.Schema({
  name: String,
  pos: [Number, Number],
  imgUrl: "string",
})

const Character = mongoose.model("Character", characterSchema)

export default Character
