import { useEffect, useState } from 'react'
import { X, FileText } from 'lucide-react'

function AddNoteModal({
  onClose,
  onSave,
  noteToEdit,
  isDarkMode = false,
}) {
  const isEditing = Boolean(noteToEdit)

  const [title, setTitle] = useState(noteToEdit?.title || '')
  const [content, setContent] = useState(noteToEdit?.content || '')

  useEffect(() => {
    setTitle(noteToEdit?.title || '')
    setContent(noteToEdit?.content || '')
  }, [noteToEdit])

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !content.trim()) return

    onSave({
      title: title.trim(),
      content: content.trim(),
    })
  }

  const modalTheme = isDarkMode
    ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-2xl shadow-black/40'
    : 'border-white/80 bg-white/90 text-[#101944] shadow-2xl shadow-slate-900/20'

  const mutedTextTheme = isDarkMode
    ? 'text-slate-400'
    : 'text-slate-500'

  const inputTheme = isDarkMode
    ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-400/15'
    : 'border-slate-200 bg-white/80 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:ring-blue-100'

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >
      <section
        className={`note-modal border backdrop-blur-2xl transition-colors duration-300 ${modalTheme}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div className="modal-heading">
            <span className="modal-icon">
              <FileText size={21} />
            </span>

            <div>
              <h2 id="modal-title">
                {isEditing
                  ? 'Edit your note'
                  : 'Create a new note'}
              </h2>

              <p className={mutedTextTheme}>
                {isEditing
                  ? 'Make changes to your note.'
                  : 'Capture a thought or idea.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`modal-close-btn ${
              isDarkMode
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : ''
            }`}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <label htmlFor="note-title">
            Title
          </label>

          <input
            id="note-title"
            type="text"
            placeholder="Give your note a title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={100}
            required
            autoFocus
            className={inputTheme}
          />

          <label htmlFor="note-content">
            Content
          </label>

          <textarea
            id="note-content"
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={5}
            required
            className={inputTheme}
          />

          <footer className="modal-actions">
            <button
              type="button"
              className={`modal-cancel-btn ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : ''
              }`}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-save-btn"
            >
              {isEditing ? 'Save Changes' : 'Create Note'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default AddNoteModal