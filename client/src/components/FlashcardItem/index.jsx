import { useState } from "react"
import styles from "./styles.module.css"

const FlashcardItem = ({ card, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className={styles.flashcard_item}>
      <div 
        className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={styles.flashcard_front}>
          <div className={styles.label}>QUESTION</div>
          <div className={styles.content}>{card.front}</div>
        </div>
        <div className={styles.flashcard_back}>
          <div className={styles.label}>ANSWER</div>
          <div className={styles.content}>{card.back}</div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.flip_btn}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? '🔄 Show Front' : '🔄 Show Back'}
        </button>
        <button 
          className={styles.edit_btn}
          onClick={() => onEdit(card)}
        >
          ✏️ Edit
        </button>
        <button 
          className={styles.delete_btn}
          onClick={() => onDelete(card._id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

export default FlashcardItem