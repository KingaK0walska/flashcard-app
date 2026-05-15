const { Flashcard, validateFlashcard } = require("../models/flashcard")
const { Deck } = require("../models/deck")
const { Progress } = require("../models/progress")

exports.createFlashcard = async (req, res) => {
  try {
    const { error } = validateFlashcard(req.body)
    if (error)
      return res.status(400).send({ message: error.details[0].message })

    const deck = await Deck.findOne({ 
      _id: req.body.deckId, 
      userId: req.user._id 
    })
    
    if (!deck)
      return res.status(404).send({ message: "Deck not found" })

    const flashcard = new Flashcard({
      ...req.body,
      userId: req.user._id
    })
    
    await flashcard.save()
    res.status(201).send({ data: flashcard, message: "Flashcard created successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.getFlashcardsByDeck = async (req, res) => {
  try {
    const deck = await Deck.findOne({ 
      _id: req.params.deckId, 
      userId: req.user._id 
    })
    
    if (!deck)
      return res.status(404).send({ message: "Deck not found" })

    const flashcards = await Flashcard.find({ 
      deckId: req.params.deckId 
    }).sort({ createdAt: -1 })
    
    res.status(200).send({ data: flashcards })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    })
    
    if (!flashcard)
      return res.status(404).send({ message: "Flashcard not found" })
    
    res.status(200).send({ data: flashcard })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.updateFlashcard = async (req, res) => {
  try {
    const { error } = validateFlashcard(req.body)
    if (error)
      return res.status(400).send({ message: error.details[0].message })

    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        front: req.body.front,
        back: req.body.back,
        updatedAt: Date.now() 
      },
      { new: true }
    )
    
    if (!flashcard)
      return res.status(404).send({ message: "Flashcard not found" })
    
    res.status(200).send({ data: flashcard, message: "Flashcard updated successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    })
    
    if (!flashcard)
      return res.status(404).send({ message: "Flashcard not found" })
    
    await Progress.deleteMany({ flashcardId: req.params.id })
    
    res.status(200).send({ message: "Flashcard deleted successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.recordProgress = async (req, res) => {
  try {
    const { flashcardId, isCorrect } = req.body
    
    const flashcard = await Flashcard.findOne({ 
      _id: flashcardId, 
      userId: req.user._id 
    })
    
    if (!flashcard)
      return res.status(404).send({ message: "Flashcard not found" })

    const update = isCorrect 
      ? { $inc: { correct: 1 }, lastReviewed: Date.now() }
      : { $inc: { incorrect: 1 }, lastReviewed: Date.now() }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, flashcardId },
      update,
      { upsert: true, new: true }
    )
    
    res.status(200).send({ data: progress })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.getDeckStats = async (req, res) => {
  try {
    const deck = await Deck.findOne({ 
      _id: req.params.deckId, 
      userId: req.user._id 
    })
    
    if (!deck)
      return res.status(404).send({ message: "Deck not found" })

    const flashcards = await Flashcard.find({ deckId: req.params.deckId })
    const flashcardIds = flashcards.map(f => f._id)
    
    const progressData = await Progress.find({
      userId: req.user._id,
      flashcardId: { $in: flashcardIds }
    })

    const totalCorrect = progressData.reduce((sum, p) => sum + p.correct, 0)
    const totalIncorrect = progressData.reduce((sum, p) => sum + p.incorrect, 0)
    const reviewedCount = progressData.length

    res.status(200).send({ 
      data: {
        totalFlashcards: flashcards.length,
        reviewedFlashcards: reviewedCount,
        correctAnswers: totalCorrect,
        incorrectAnswers: totalIncorrect,
        accuracy: totalCorrect + totalIncorrect > 0 
          ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) 
          : 0
      }
    })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}