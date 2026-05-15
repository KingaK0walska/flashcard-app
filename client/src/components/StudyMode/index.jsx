import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate, useParams, Link } from "react-router-dom"
import styles from "./styles.module.css"

const StudyMode = () => {
  const [deck, setDeck] = useState(null)
  const [flashcards, setFlashcards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 })
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  const fetchStudyData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }

      const [deckRes, flashcardsRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/decks/${id}`, config),
        axios.get(`http://localhost:3001/api/flashcards/deck/${id}`, config)
      ])

      setDeck(deckRes.data.data)

      const shuffled = [...flashcardsRes.data.data].sort(() => Math.random() - 0.5)
      setFlashcards(shuffled)
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
    fetchStudyData()
  }, [fetchStudyData])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = async (isCorrect) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }

      await axios.post(
        "http://localhost:3001/api/flashcards/progress",
        {
          flashcardId: flashcards[currentIndex]._id,
          isCorrect
        },
        config
      )

      setSessionStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1)
      }))

      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
      } else {
        setShowResults(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionStats({ correct: 0, incorrect: 0 })
    setShowResults(false)
    
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (!deck || flashcards.length === 0) {
    return (
      <div className={styles.empty_container}>
        <h2>No flashcards to study</h2>
        <p>Add some flashcards to this deck first!</p>
        <Link to={`/decks/${id}`}>
          <button className={styles.back_btn}>Go to Deck</button>
        </Link>
      </div>
    )
  }

  if (showResults) {
    const total = sessionStats.correct + sessionStats.incorrect
    const percentage = Math.round((sessionStats.correct / total) * 100)

    return (
      <div className={styles.results_container}>
        <div className={styles.results_card}>
          <h1>🎉 Study Session Complete!</h1>
          
          <div className={styles.score_circle}>
            <div className={styles.score_percentage}>{percentage}%</div>
            <div className={styles.score_label}>Accuracy</div>
          </div>

          <div className={styles.results_stats}>
            <div className={styles.result_stat}>
              <span className={styles.stat_value_correct}>{sessionStats.correct}</span>
              <span className={styles.stat_label}>Correct</span>
            </div>
            <div className={styles.result_stat}>
              <span className={styles.stat_value_incorrect}>{sessionStats.incorrect}</span>
              <span className={styles.stat_label}>Incorrect</span>
            </div>
            <div className={styles.result_stat}>
              <span className={styles.stat_value_total}>{total}</span>
              <span className={styles.stat_label}>Total</span>
            </div>
          </div>

          <div className={styles.results_actions}>
            <button className={styles.restart_btn} onClick={handleRestart}>
              Study Again
            </button>
            <Link to={`/decks/${id}`}>
              <button className={styles.done_btn}>
                ✓ Done
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  return (
    <div className={styles.study_container}>
      <nav className={styles.navbar}>
        <Link to={`/decks/${id}`} className={styles.back_link}>← Exit Study</Link>
        <h2>{deck.name}</h2>
        <div className={styles.session_stats}>
          <span className={styles.correct_count}>✓ {sessionStats.correct}</span>
          <span className={styles.incorrect_count}>✗ {sessionStats.incorrect}</span>
        </div>
      </nav>

      <div className={styles.progress_bar}>
        <div className={styles.progress_fill} style={{ width: `${progress}%` }}></div>
      </div>

      <div className={styles.study_content}>
        <div className={styles.card_counter}>
          Card {currentIndex + 1} of {flashcards.length}
        </div>

        <div 
          className={`${styles.study_card} ${isFlipped ? styles.flipped : ''}`}
          onClick={handleFlip}
        >
          <div className={styles.card_inner}>
            <div className={styles.card_front}>
              <div className={styles.card_label}>Question</div>
              <div className={styles.card_content}>{currentCard.front}</div>
              <div className={styles.card_hint}>Click to reveal answer</div>
            </div>
            <div className={styles.card_back}>
              <div className={styles.card_label}>Answer</div>
              <div className={styles.card_content}>{currentCard.back}</div>
            </div>
          </div>
        </div>

        {isFlipped && (
          <div className={styles.answer_buttons}>
            <button 
              className={styles.incorrect_btn}
              onClick={() => handleAnswer(false)}
            >
              ✗ Incorrect
            </button>
            <button 
              className={styles.correct_btn}
              onClick={() => handleAnswer(true)}
            >
              ✓ Correct
            </button>
          </div>
        )}

        
      </div>
    </div>
  )
}

export default StudyMode