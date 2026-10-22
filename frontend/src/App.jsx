
import { useCallback, useEffect, useState } from 'react'
import './App.css'

import AuthModal from './components/auth/AuthModal.jsx'
import BackgroundBubbles from './components/BackgroundBubbles.jsx'
import Sidebar from './components/Sidebar.jsx'
import Toolbar from './components/Toolbar.jsx'
import NotesGrid from './components/NotesGrid.jsx'
import AddNoteModal from './components/AddNoteModal.jsx'
import ViewNoteModal from './components/ViewNoteModal.jsx'

import { availableColors } from './data/initialNotes.js'
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  restoreNote,
  permanentlyDeleteNote,
  clearTrash,
} from './services/noteService.js'

// Convert the backend's note data into the format used by the UI.
function formatNote(note) {
  const createdAt = note.createdAt || note.created_at

  return {
    ...note,
    id: note.id,
    isFavorite: note.isFavorite ?? false,
    isDeleted: note.isDeleted ?? false,
    date: createdAt
      ? new Date(createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '',
  }
}

// Some API routes return a note directly; others return { note: ... }.
function extractNote(response) {
  return response?.note ?? response
}

function App() {
  const [notes, setNotes] = useState([])
  const [trash, setTrash] = useState([])
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [activeView, setActiveView] = useState('all')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const loadNotes = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true)
    }

    try {
      setErrorMessage('')

      const [activeNotes, trashedNotes] = await Promise.all([
        getNotes(),
        getNotes('trash'),
      ])

      setNotes(activeNotes.map(formatNote))
      setTrash(trashedNotes.map(formatNote))
    } catch (error) {
      console.error('Error loading notes:', error)
      setErrorMessage(
        'Unable to load notes. Please check that the backend and database are running.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotes(true)
  }, [loadNotes])

  function getNoteId(noteOrId) {
    return noteOrId !== null && typeof noteOrId === 'object'
      ? noteOrId.id
      : noteOrId
  }

  function idsMatch(note, noteId) {
    return String(note.id) === String(noteId)
  }

  function handleOpenViewNote(note) {
    setSelectedNote(note)
  }

  function handleCloseViewNote() {
    setSelectedNote(null)
  }

  function handleOpenCreateModal() {
    if (activeView === 'trash') return

    setSelectedNote(null)
    setNoteToEdit(null)
    setIsModalOpen(true)
  }

  function handleOpenEditModal(note) {
    if (activeView === 'trash') return

    setSelectedNote(null)
    setNoteToEdit(note)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setNoteToEdit(null)
  }

  // Create a note or save changes to an existing note.
  async function handleSaveNote(noteData) {
    if (isSaving) return

    setIsSaving(true)
    setErrorMessage('')

    try {
      if (noteToEdit) {
        const updatedData = {
          title: noteData.title.trim(),
          content: noteData.content.trim(),
          color: noteToEdit.color || 'blue',
          isFavorite: noteToEdit.isFavorite ?? false,
        }

        const response = await updateNote(
          noteToEdit.id,
          updatedData,
        )

        const savedNote = formatNote(extractNote(response))

        setNotes((currentNotes) =>
          currentNotes.map((note) =>
            idsMatch(note, savedNote.id) ? savedNote : note,
          ),
        )

        setSelectedNote((current) =>
          current && idsMatch(current, savedNote.id)
            ? savedNote
            : current,
        )
      } else {
        const usedColors = new Set(
          notes.map((note) => note.color),
        )

        const unusedColors = availableColors.filter(
          (color) => !usedColors.has(color),
        )

        const colorPool =
          unusedColors.length > 0
            ? unusedColors
            : availableColors

        const color =
          colorPool[
            Math.floor(Math.random() * colorPool.length)
          ] || 'blue'

        const response = await createNote({
          ...noteData,
          title: noteData.title.trim(),
          content: noteData.content.trim(),
          color,
          isFavorite: false,
        })

        const savedNote = formatNote(extractNote(response))

        setNotes((currentNotes) => [
          savedNote,
          ...currentNotes.filter(
            (note) => !idsMatch(note, savedNote.id),
          ),
        ])
      }

      handleCloseModal()
    } catch (error) {
      console.error('Error saving note:', error)
      setErrorMessage(
        'Unable to save your note. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  // Move an active note to Trash.
  async function handleMoveToTrash(noteOrId) {
    const noteId = getNoteId(noteOrId)

    const noteToMove = notes.find((note) =>
      idsMatch(note, noteId),
    )

    if (!noteToMove) {
      console.error('Note not found in active notes:', noteId)
      return false
    }

    const confirmed = window.confirm(
      'Are you sure you want to move this note to Trash?',
    )

    if (!confirmed) return false

    try {
      setErrorMessage('')
      await deleteNote(noteId)

      setNotes((currentNotes) =>
        currentNotes.filter(
          (note) => !idsMatch(note, noteId),
        ),
      )

      setTrash((currentTrash) => [
        { ...noteToMove, isDeleted: true },
        ...currentTrash.filter(
          (note) => !idsMatch(note, noteId),
        ),
      ])

      setSelectedNote(null)
      return true
    } catch (error) {
      console.error('Error moving note to Trash:', error)
      setErrorMessage(
        'Unable to move the note to Trash. Please try again.',
      )
      return false
    }
  }

  // Permanently delete a note that is already in Trash.
  async function handlePermanentDelete(noteOrId) {
    const noteId = getNoteId(noteOrId)

    const noteInTrash = trash.find((note) =>
      idsMatch(note, noteId),
    )

    if (!noteInTrash) {
      console.error('Note not found in Trash:', noteId)
      return false
    }

    const confirmed = window.confirm(
      'Permanently delete this note? This action cannot be undone.',
    )

    if (!confirmed) return false

    try {
      setErrorMessage('')
      await permanentlyDeleteNote(noteId)

      setTrash((currentTrash) =>
        currentTrash.filter(
          (note) => !idsMatch(note, noteId),
        ),
      )

      setSelectedNote(null)
      return true
    } catch (error) {
      console.error('Error permanently deleting note:', error)
      setErrorMessage(
        'Unable to permanently delete the note. Please try again.',
      )
      return false
    }
  }

  function handleDeleteNote(noteOrId) {
    if (activeView === 'trash') {
      return handlePermanentDelete(noteOrId)
    }

    return handleMoveToTrash(noteOrId)
  }

  async function handleDeleteFromView(noteOrId) {
    const noteId = getNoteId(noteOrId)

    if (trash.some((note) => idsMatch(note, noteId))) {
      return handlePermanentDelete(noteId)
    }

    return handleMoveToTrash(noteId)
  }

  // Restore a trashed note through the backend.
  async function handleRestoreNote(noteOrId) {
    const noteId = getNoteId(noteOrId)

    const noteToRestore = trash.find((note) =>
      idsMatch(note, noteId),
    )

    if (!noteToRestore) {
      console.error('Note not found in Trash:', noteId)
      return
    }

    try {
      setErrorMessage('')
      const response = await restoreNote(noteId)
      const restoredNote = formatNote(extractNote(response))

      setTrash((currentTrash) =>
        currentTrash.filter(
          (note) => !idsMatch(note, noteId),
        ),
      )

      setNotes((currentNotes) => [
        restoredNote,
        ...currentNotes.filter(
          (note) => !idsMatch(note, noteId),
        ),
      ])

      setSelectedNote(null)
    } catch (error) {
      console.error('Error restoring note:', error)
      setErrorMessage(
        'Unable to restore the note. Please try again.',
      )
    }
  }

  // Permanently delete every note currently in Trash.
  async function handleClearTrash() {
    if (trash.length === 0) return

    const confirmed = window.confirm(
      `Permanently delete all ${trash.length} notes in Trash? This action cannot be undone.`,
    )

    if (!confirmed) return

    try {
      setErrorMessage('')
      await clearTrash()

      setTrash([])
      setSelectedNote(null)
    } catch (error) {
      console.error('Error clearing Trash:', error)
      setErrorMessage(
        'Unable to clear Trash. Please try again.',
      )
    }
  }

  // Save favorite changes to PostgreSQL.
  async function handleToggleFavorite(noteOrId) {
    if (activeView === 'trash') return

    const noteId = getNoteId(noteOrId)
    const note = notes.find((item) => idsMatch(item, noteId))

    if (!note) return

    const updatedData = {
      title: note.title,
      content: note.content,
      color: note.color || 'blue',
      isFavorite: !note.isFavorite,
    }

    try {
      setErrorMessage('')

      const response = await updateNote(noteId, updatedData)
      const savedNote = formatNote(extractNote(response))

      setNotes((currentNotes) =>
        currentNotes.map((item) =>
          idsMatch(item, noteId) ? savedNote : item,
        ),
      )

      setSelectedNote((current) =>
        current && idsMatch(current, noteId)
          ? savedNote
          : current,
      )
    } catch (error) {
      console.error('Error updating favorite:', error)
      setErrorMessage(
        'Unable to update favorite status. Please try again.',
      )
    }
  }

  function handleToggleDarkMode() {
    setIsDarkMode((current) => !current)
  }

  const favoriteCount = notes.filter(
    (note) => note.isFavorite,
  ).length

  const sourceNotes =
    activeView === 'trash'
      ? trash
      : activeView === 'favorites'
        ? notes.filter((note) => note.isFavorite)
        : notes

  const query = search.trim().toLowerCase()

  const filteredNotes = sourceNotes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    )
    .sort((a, b) => {
      const aTime = new Date(
        a.createdAt || a.created_at || 0,
      ).getTime()
      const bTime = new Date(
        b.createdAt || b.created_at || 0,
      ).getTime()

      return sortOrder === 'newest'
        ? bTime - aTime
        : aTime - bTime
    })

  const selectedNoteId = selectedNote?.id

  const currentSelectedNote =
    selectedNoteId == null
      ? null
      : [...notes, ...trash].find((note) =>
          idsMatch(note, selectedNoteId),
        ) ?? null

  const viewTitles = {
    all: 'All Notes',
    favorites: 'Favourites',
    trash: 'Trash',
  }

  const viewSubtitles = {
    all: 'Your thoughts, ideas and tasks in one place.',
    favorites: 'Your favourite notes, all in one place.',
    trash:
      'Notes you have removed. Restore them or delete them permanently.',
  }

  return (
    <div
      className={`relative isolate flex min-h-screen flex-col gap-5 overflow-hidden p-3 transition-colors duration-300 sm:p-5 lg:flex-row lg:gap-7 lg:p-6 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-[#e8edfb] text-[#101944]'
      }`}
    >
      <BackgroundBubbles isDarkMode={isDarkMode} />

      <Sidebar
        notesCount={notes.length}
        favoriteCount={favoriteCount}
        trashCount={trash.length}
        activeView={activeView}
        onChangeView={setActiveView}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <main className="relative z-10 min-w-0 flex-1 py-1 lg:py-2">
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onCreateNote={handleOpenCreateModal}
          onClearTrash={handleClearTrash}
          isTrash={activeView === 'trash'}
          isDarkMode={isDarkMode}
        />

        {errorMessage && (
          <div
            role="alert"
            className="my-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <div className="flex items-center justify-between gap-3">
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="shrink-0 font-semibold"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <section>
          <div className="mb-6">
            <h1
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
                isDarkMode
                  ? 'text-slate-100'
                  : 'text-[#101944]'
              }`}
            >
              {viewTitles[activeView]} ({filteredNotes.length})
            </h1>

            <p
              className={`mt-2 text-sm ${
                isDarkMode
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              {viewSubtitles[activeView]}
            </p>
          </div>

          {isLoading ? (
            <div
              className="rounded-2xl p-8 text-center text-sm text-slate-500"
              role="status"
            >
              Loading your notes...
            </div>
          ) : (
            <NotesGrid
              notes={filteredNotes}
              onToggleFavorite={handleToggleFavorite}
              onEditNote={handleOpenEditModal}
              onDeleteNote={handleDeleteNote}
              onCreateNote={handleOpenCreateModal}
              onRestoreNote={handleRestoreNote}
              onViewNote={handleOpenViewNote}
              isTrash={activeView === 'trash'}
              isDarkMode={isDarkMode}
            />
          )}
        </section>
      </main>

      {currentSelectedNote && (
        <ViewNoteModal
          note={currentSelectedNote}
          onClose={handleCloseViewNote}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteFromView}
          onToggleFavorite={handleToggleFavorite}
          isDarkMode={isDarkMode}
        />
      )}

      {isModalOpen && (
        <AddNoteModal
          onClose={handleCloseModal}
          onSave={handleSaveNote}
          noteToEdit={noteToEdit}
          isDarkMode={isDarkMode}
          isSaving={isSaving}
        />
      )}

      {!isAuthenticated && (
        <div className="fixed inset-0 z-[100] overflow-y-auto backdrop-blur-md">
          <div className="absolute inset-0 bg-[#101944]/35" />

          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <AuthModal
              onSuccess={() => setIsAuthenticated(true)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
