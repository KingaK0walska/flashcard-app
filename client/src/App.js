import { Route, Routes, Navigate } from "react-router-dom"
import Dashboard from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import DeckForm from "./components/DeckForm"
import DeckDetail from "./components/DeckDetail"
import StudyMode from "./components/StudyMode"

function App() {
  const user = localStorage.getItem("token")

  return (
    <Routes>
      {user && <Route path="/" exact element={<Dashboard />} />}
      {user && <Route path="/decks/new" element={<DeckForm />} />}
      {user && <Route path="/decks/:id/edit" element={<DeckForm />} />}
      {user && <Route path="/decks/:id" element={<DeckDetail />} />}
      {user && <Route path="/decks/:id/study" element={<StudyMode />} />}
      
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  )
}

export default App