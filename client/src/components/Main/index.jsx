import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import styles from "./styles.module.css"

const Dashboard = () => {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, totalFlashcards: 0 })
  const navigate = useNavigate()

  const fetchDecks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }
      const { data } = await axios.get("http://localhost:3001/api/decks", config)
      setDecks(data.data)
      
      const totalFlashcards = data.data.reduce((sum, deck) => sum + deck.flashcardCount, 0)
      setStats({ total: data.data.length, totalFlashcards })
      setLoading(false)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
      console.error(error)
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchDecks()
  }, [fetchDecks])


  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleDeleteDeck = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deck and all its flashcards?")) return
    
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }
      await axios.delete(`http://localhost:3001/api/decks/${id}`, config)
      fetchDecks()
    } catch (error) {
      console.error(error)
      alert("Error deleting deck")
    }
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

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.dashboard_container}>
      <nav className={styles.navbar}>
        <h1>📚 Flashcard App</h1>
        <button className={styles.logout_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h2>My Decks</h2>
            <p className={styles.stats}>
              {stats.total} decks • {stats.totalFlashcards} flashcards
            </p>
          </div>
          <Link to="/decks/new">
            <button className={styles.add_btn}>
              + New Deck
            </button>
          </Link>
        </div>

        {decks.length === 0 ? (
          <div className={styles.empty_state}>
            <h3>No decks yet</h3>
            <p>Create your first deck to start learning!</p>
            <Link to="/decks/new">
              <button className={styles.create_first_btn}>
                Create First Deck
              </button>
            </Link>
          </div>
        ) : (
          <div className={styles.decks_grid}>
            {decks.map((deck) => (
              <div key={deck._id} className={styles.deck_card}>
                <div 
                  className={styles.deck_category} 
                  style={{ backgroundColor: getCategoryColor(deck.category) }}
                >
                  {deck.category}
                </div>
                
                <h3>{deck.name}</h3>
                <p className={styles.deck_description}>{deck.description}</p>
                
                <div className={styles.deck_info}>
                  <span className={styles.flashcard_count}>
                    📝 {deck.flashcardCount} cards
                  </span>
                </div>

                <div className={styles.deck_actions}>
                  <Link to={`/decks/${deck._id}/study`}>
                    <button className={styles.study_btn}>Study</button>
                  </Link>
                  <Link to={`/decks/${deck._id}`}>
                    <button className={styles.view_btn}>View</button>
                  </Link>
                  <Link to={`/decks/${deck._id}/edit`}>
                    <button className={styles.edit_btn}>Edit</button>
                  </Link>
                  <button 
                    className={styles.delete_btn}
                    onClick={() => handleDeleteDeck(deck._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard