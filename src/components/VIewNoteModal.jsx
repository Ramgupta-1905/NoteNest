import { useEffect } from 'react'
import {
  X,
  CalendarDays,
  Star,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react'
import { cardColors } from '../data/initialNotes'

function ViewNoteModal({
  note,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  isDarkMode = false,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!note) return null

  const noteColor = cardColors[note.color] || cardColors.blue

  function handleEdit() {
    onEdit(note)
  }

  function handleDelete(event) {
    event.preventDefault()
    event.stopPropagation()

    console.log('Move to Trash clicked. Note ID:', note.id)

    onDelete(note.id)
  }

  function handleToggleFavorite(event) {
    event.preventDefault()
    event.stopPropagation()

    onToggleFavorite(note.id)
  }

  return (
    <div
      className={`modal-overlay ${isDarkMode ? 'dark-mode' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-note-title"
        className={`view-note-modal ${isDarkMode ? 'dark-mode' : ''}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="view-note-header">
          <div className="view-note-icon" style={noteColor}>
            <FileText size={25} />
          </div>

          <div className="view-note-heading">
            <h2 id="view-note-title">{note.title}</h2>

            <p className="view-note-date">
              <CalendarDays size={15} />
              <span>{note.date}</span>
            </p>
          </div>

          <button
            type="button"
            className="view-note-close"
            onClick={onClose}
            aria-label="Close note"
            title="Close"
          >
            <X size={21} />
          </button>
        </header>

        <div className="view-note-content">
          <h3>Content</h3>
          <div className="view-note-text">{note.content}</div>
        </div>

        <footer className="view-note-footer">
          <button
            type="button"
            className={`view-note-favorite ${
              note.isFavorite ? 'is-favorite' : ''
            }`}
            onClick={handleToggleFavorite}
            aria-pressed={Boolean(note.isFavorite)}
          >
            <Star
              size={19}
              fill={note.isFavorite ? 'currentColor' : 'none'}
            />

            <span>
              {note.isFavorite
                ? 'Remove Favourite'
                : 'Add to Favourites'}
            </span>
          </button>

          <div className="view-note-actions">
            <button
              type="button"
              className="view-note-edit"
              onClick={handleEdit}
            >
              <Pencil size={17} />
              <span>Edit Note</span>
            </button>

            <button
              type="button"
              className="view-note-delete"
              onClick={handleDelete}
            >
              <Trash2 size={17} />
              <span>Move to Trash</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default ViewNoteModal