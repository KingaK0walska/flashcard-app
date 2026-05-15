const router = require("express").Router()
const auth = require("../middleware/auth")
const deckController = require("../controllers/deckController")

router.post("/", auth, deckController.createDeck)
router.get("/", auth, deckController.getAllDecks)
router.get("/:id", auth, deckController.getDeckById)
router.put("/:id", auth, deckController.updateDeck)
router.delete("/:id", auth, deckController.deleteDeck)

module.exports = router