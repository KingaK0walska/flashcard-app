import axios from "axios"
import { useNavigate, useParams, Link } from "react-router-dom"
import FlashcardItem from "../FlashcardItem"
import FlashcardFormModal from "../FlashcardFormModal"
import styles from "./styles.module.css"
import { useState, useEffect, useCallback } from "react"

const DeckDetail = () => {
  const [deck, setDeck] = useState(null)
  const [flashcards, setFlashcards] = useState([])
  const [stats, setStats] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  const fetchDeckData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }

      const [deckRes, flashcardsRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/decks/${id}`, config),
        axios.get(`http://localhost:3001/api/flashcards/deck/${id}`, config),
        axios.get(`http://localhost:3001/api/flashcards/deck/${id}/stats`, config)
      ])

      setDeck(deckRes.data.data)
      setFlashcards(flashcardsRes.data.data)
      setStats(statsRes.data.data)
      setLoading(false)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
      console.error(error)
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    fetchDeckData()
  }, [fetchDeckData])

  const handleAddCard = () => {
    setEditingCard(null)
    setShowModal(true)
  }

  const handleEditCard = (card) => {
    setEditingCard(card)
    setShowModal(true)
  }

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) return
    
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }
      await axios.delete(`http://localhost:3001/api/flashcards/${cardId}`, config)
      fetchDeckData()
    } catch (error) {
      console.error(error)
      alert("Error deleting flashcard")
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingCard(null)
    fetchDeckData()
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (!deck) {
    return <div className={styles.error}>Deck not found</div>
  }

  return (
    <div className={styles.deck_detail_container}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.back_link}>← Back to Dashboard</Link>
      </nav>

      <div className={styles.content}>
        <div className={styles.deck_header}>
          <div className={styles.deck_info}>
            <div className={styles.category_badge} 
                 style={{ backgroundColor: getCategoryColor(deck.category) }}>
              {deck.category}
            </div>
            <h1>{deck.name}</h1>
            <p className={styles.description}>{deck.description}</p>
          </div>
          
          <div className={styles.actions}>
            <Link to={`/decks/${id}/study`}>
              <button className={styles.study_btn}>
                🎯 Study Now
              </button>
            </Link>
            <Link to={`/decks/${id}/edit`}>
              <button className={styles.edit_btn}>
                ✏️ Edit Deck
              </button>
            </Link>
          </div>
        </div>

        {stats && (
          <div className={styles.stats_section}>
            <div className={styles.stat_card}>
              <div className={styles.stat_value}>{stats.totalFlashcards}</div>
              <div className={styles.stat_label}>Total Cards</div>
            </div>
            <div className={styles.stat_card}>
              <div className={styles.stat_value}>{stats.reviewedFlashcards}</div>
              <div className={styles.stat_label}>Reviewed</div>
            </div>
            <div className={styles.stat_card}>
              <div className={styles.stat_value}>{stats.accuracy}%</div>
              <div className={styles.stat_label}>Accuracy</div>
            </div>
            <div className={styles.stat_card}>
              <div className={styles.stat_value}>{stats.correctAnswers}</div>
              <div className={styles.stat_label}>Correct in total</div>
            </div>
          </div>
        )}

        <div className={styles.flashcards_section}>
          <div className={styles.section_header}>
            <h2>Flashcards ({flashcards.length})</h2>
            <button className={styles.add_card_btn} onClick={handleAddCard}>
              + Add Flashcard
            </button>
          </div>

          {flashcards.length === 0 ? (
            <div className={styles.empty_state}>
              <h3>No flashcards yet</h3>
              <p>Add your first flashcard to start learning!</p>
              <button className={styles.create_first_btn} onClick={handleAddCard}>
                Create First Flashcard
              </button>
            </div>
          ) : (
            <div className={styles.flashcards_list}>
              {flashcards.map((card) => (
                <FlashcardItem
                  key={card._id}
                  card={card}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <FlashcardFormModal
          deckId={id}
          card={editingCard}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

const getCategoryColor = (category) => {
  const colors = {
    languages: '#3b82f6',
    science: '#10b981',
    history: '#f59e0b',
    programming: '#8b5cf6',
    other: '#6b7280'
  }
  return colors[category] || colors.other
}

export default DeckDetail