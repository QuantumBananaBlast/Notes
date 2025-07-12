import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'

const App = ( ) => {
  const [ notes , setNotes ] = useState([])
  const [ newNote, setNewNote] = useState('a new note...')
  const [ showAll, setShowAll ] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const toogleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important : !note.important}
    
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(() => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(()=> setErrorMessage(null),5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)    
      })
    }, [])

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content : newNote,
      important : Math.random()<0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
    
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance = {() => toogleImportanceOf(note.id)}
            />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App