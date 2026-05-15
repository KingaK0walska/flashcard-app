import { useState, useEffect } from "react"
import axios from "axios"
import styles from "./styles.module.css"

const FlashcardFormModal = ({ deckId, card, onClose }) => {
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    deckId: deckId
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (card) {
      setFormData({
        front: card.front,
        back: card.back,
        deckId: card.deckId
      })
    }
  }, [card])

  const handleChange = ({ currentTarget: input }) => {
    setFormData({ ...formData, [input.name]: input.value })
    setError("")
  }

  const validateForm = () => {
    if (formData.front.length < 1) {
      setError("Front side cannot be empty")
      return false
    }
    if (formData.back.length < 1) {
      setError("Back side cannot be empty")
      return false
    }
    if (formData.front.length > 500) {
      setError("Front side is too long (max 500 characters)")
      return false
    }
    if (formData.back.length > 500) {
      setError("Back side is too long (max 500 characters)")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }

      if (card) {
        await axios.put(
          `http://localhost:3001/api/flashcards/${card._id}`,
          formData,
          config
        )
      } else {
        await axios.post(
          "http://localhost:3001/api/flashcards",
          formData,
          config
        )
      }
      
      onClose()
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <h2>{card ? "Edit Flashcard" : "Create New Flashcard"}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label>Front Side *</label>
            <textarea
              name="front"
              value={formData.front}
              onChange={handleChange}
              placeholder="Question or term"
              required
              rows={4}
              maxLength={500}
            />
            <small>{formData.front.length}/500 characters</small>
          </div>

          <div className={styles.form_group}>
            <label>Back Side *</label>
            <textarea
              name="back"
              value={formData.back}
              onChange={handleChange}
              placeholder="Answer or definition"
              required
              rows={4}
              maxLength={500}
            />
            <small>{formData.back.length}/500 characters</small>
          </div>

          {error && <div className={styles.error_msg}>{error}</div>}

          <div className={styles.button_group}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancel_btn}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={styles.submit_btn}
            >
              {loading ? "Saving..." : (card ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FlashcardFormModal