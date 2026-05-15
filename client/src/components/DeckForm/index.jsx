import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate, useParams, Link } from "react-router-dom"
import styles from "./styles.module.css"

const DeckForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
    
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const fetchDeck = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { "x-auth-token": token }
      }
      const { data } = await axios.get(`http://localhost:3001/api/decks/${id}`, config)
      setFormData({
        name: data.data.name,
        description: data.data.description,
        category: data.data.category,
        
      })
    } catch (error) {
      console.error(error)
      alert("Error loading deck")
      navigate("/")
    }
  }, [id, navigate])

  useEffect(() => {
    if (isEdit) {
      fetchDeck()
    }
  }, [isEdit, fetchDeck])

  const handleChange = ({ currentTarget: input }) => {
  setFormData({ ...formData, [input.name]: input.value })
  setError("")
}


  const validateForm = () => {
    if (formData.name.length < 3) {
      setError("Name must be at least 3 characters long")
      return false
    }
    if (formData.description.length < 5) {
      setError("Description must be at least 5 characters long")
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

      if (isEdit) {
        await axios.put(
          `http://localhost:3001/api/decks/${id}`,
          formData,
          config
        )
      } else {
        await axios.post(
          "http://localhost:3001/api/decks",
          formData,
          config
        )
      }
      
      navigate("/")
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
    <div className={styles.form_container}>
      <div className={styles.form_wrapper}>
        <div className={styles.form_header}>
          <Link to="/" className={styles.back_link}>← Back to Dashboard</Link>
          <h2>{isEdit ? "Edit Deck" : "Create New Deck"}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label>Deck Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Spanish Vocabulary"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className={styles.form_group}>
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this deck"
              required
              minLength={5}
              maxLength={200}
              rows={3}
            />
          </div>

          <div className={styles.form_group}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="languages">Languages</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="programming">Programming</option>
              <option value="other">Other</option>
            </select>
          </div>


          {error && <div className={styles.error_msg}>{error}</div>}

          <div className={styles.button_group}>
            <Link to="/">
              <button type="button" className={styles.cancel_btn}>
                Cancel
              </button>
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className={styles.submit_btn}
            >
              {loading ? "Saving..." : (isEdit ? "Update Deck" : "Create Deck")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeckForm