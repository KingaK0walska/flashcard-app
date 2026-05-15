const mongoose = require("mongoose")
const Joi = require("joi")

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  deckId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Deck', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Flashcard = mongoose.model("Flashcard", flashcardSchema)

const validateFlashcard = (data) => {
  const schema = Joi.object({
    front: Joi.string().min(1).max(500).required().label("Front"),
    back: Joi.string().min(1).max(500).required().label("Back"),
    deckId: Joi.string().required().label("Deck ID")
  })
  return schema.validate(data)
}

module.exports = { Flashcard, validateFlashcard }