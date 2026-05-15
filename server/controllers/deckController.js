const { Deck, validateDeck } = require("../models/deck")
const { Flashcard } = require("../models/flashcard")

exports.createDeck = async (req, res) => {
  try {
    const { error } = validateDeck(req.body)
    if (error)
      return res.status(400).send({ message: error.details[0].message })

    const deck = new Deck({
      ...req.body,
      userId: req.user._id
    })
    
    await deck.save()
    res.status(201).send({ data: deck, message: "Deck created successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.getAllDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ userId: req.user._id }).sort({ createdAt: -1 })
    
    const decksWithCount = await Promise.all(
      decks.map(async (deck) => {
        const count = await Flashcard.countDocuments({ deckId: deck._id })
        return {
          ...deck.toObject(),
          flashcardCount: count
        }
      })
    )
    
    res.status(200).send({ data: decksWithCount })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    })
    
    if (!deck)
      return res.status(404).send({ message: "Deck not found" })
    
    const flashcardCount = await Flashcard.countDocuments({ deckId: deck._id })
    
    res.status(200).send({ 
      data: {
        ...deck.toObject(),
        flashcardCount
      }
    })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.updateDeck = async (req, res) => {
  try {
    const { error } = validateDeck(req.body)
    if (error)
      return res.status(400).send({ message: error.details[0].message })

    const deck = await Deck.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    
    if (!deck)
      return res.status(404).send({ message: "Deck not found" })
    
    res.status(200).send({ data: deck, message: "Deck updated successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

exports.deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    })
    
    if (!deck)
      return res.status(404).send({ message: "Deck not found" })
    
    await Flashcard.deleteMany({ deckId: req.params.id })
    
    res.status(200).send({ message: "Deck and all flashcards deleted successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}