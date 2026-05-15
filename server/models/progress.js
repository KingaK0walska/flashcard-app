const mongoose = require("mongoose")

const progressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  flashcardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Flashcard', 
    required: true 
  },
  deckId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Deck', 
    required: true 
  },
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
  lastReviewed: { type: Date, default: Date.now }
})

progressSchema.index({ userId: 1, flashcardId: 1 }, { unique: true })

const Progress = mongoose.model("Progress", progressSchema)

module.exports = { Progress }