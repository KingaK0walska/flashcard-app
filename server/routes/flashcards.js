const router = require("express").Router()
const auth = require("../middleware/auth")
const flashcardController = require("../controllers/flashcardController")

router.post("/", auth, flashcardController.createFlashcard)
router.get("/deck/:deckId", auth, flashcardController.getFlashcardsByDeck)
router.get("/:id", auth, flashcardController.getFlashcardById)
router.put("/:id", auth, flashcardController.updateFlashcard)
router.delete("/:id", auth, flashcardController.deleteFlashcard)

router.post("/progress", auth, flashcardController.recordProgress)
router.get("/deck/:deckId/stats", auth, flashcardController.getDeckStats)

module.exports = router