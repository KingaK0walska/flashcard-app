const mongoose = require("mongoose")
const Joi = require("joi")

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['languages', 'science', 'history', 'programming', 'other'],
    default: 'other'
  },
  isPublic: { type: Boolean, default: false },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Deck = mongoose.model("Deck", deckSchema)

const validateDeck = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().label("Name"),
    description: Joi.string().min(5).max(200).required().label("Description"),
    category: Joi.string().valid('languages', 'science', 'history', 'programming', 'other').label("Category"),
    isPublic: Joi.boolean().label("Public")
  })
  return schema.validate(data)
}

module.exports = { Deck, validateDeck }