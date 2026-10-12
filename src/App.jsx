import { useState } from 'react'
import './App.css'

import AuthModal from './components/auth/AuthModal.jsx'
import BackgroundBubbles from './components/BackgroundBubbles.jsx'
import Sidebar from './components/Sidebar.jsx'
import Toolbar from './components/Toolbar.jsx'
import NotesGrid from './components/NotesGrid.jsx'
import AddNoteModal from './components/AddNoteModal.jsx'
import ViewNoteModal from './components/ViewNoteModal.jsx'

import { initialNotes, availableColors } from './data/initialNotes.js'
import { createNote, updateNote } from './services/noteService.js'

function App() {
  const [notes, setNotes] = useState(initialNotes)
  const [trash, setTrash] = useState([])
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [activeView, setActiveView] = useState('all')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  function handleSaveNote(noteData) {
    if (noteToEdit) {
      setNotes((currentNotes) =>
        updateNote(currentNotes, noteToEdit.id, {
          ...noteData,
          color: noteToEdit.color,
          isFavorite: noteToEdit.isFavorite ?? false,
        }),
      )
    } else {
      setNotes((currentNotes) => {
        const usedColors = new Set(
          currentNotes.map((note) => note.color),
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
          ]

        return createNote(currentNotes, {
          ...noteData,
          color,
          isFavorite: false,
        })
      })
    }

    handleCloseModal()
  }

  // Move a note from All Notes or Favourites to Trash.
  function handleMoveToTrash(noteOrId) {
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

    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => !idsMatch(note, noteId),
      ),
    )

    setTrash((currentTrash) => [
      { ...noteToMove },
      ...currentTrash.filter(
        (note) => !idsMatch(note, noteId),
      ),
    ])

    setSelectedNote(null)
    return true
  }

  // Permanently delete a note from Trash.
  function handlePermanentDelete(noteOrId) {
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

    setTrash((currentTrash) =>
      currentTrash.filter(
        (note) => !idsMatch(note, noteId),
      ),
    )

    setSelectedNote(null)
    return true
  }

  function handleDeleteNote(noteOrId) {
    if (activeView === 'trash') {
      return handlePermanentDelete(noteOrId)
    }

    return handleMoveToTrash(noteOrId)
  }

  function handleDeleteFromView(noteOrId) {
    const noteId = getNoteId(noteOrId)

    if (trash.some((note) => idsMatch(note, noteId))) {
      return handlePermanentDelete(noteId)
    }

    return handleMoveToTrash(noteId)
  }

  function handleRestoreNote(noteOrId) {
    const noteId = getNoteId(noteOrId)

    const noteToRestore = trash.find((note) =>
      idsMatch(note, noteId),
    )

    if (!noteToRestore) {
      console.error('Note not found in Trash:', noteId)
      return
    }

    setTrash((currentTrash) =>
      currentTrash.filter(
        (note) => !idsMatch(note, noteId),
      ),
    )

    setNotes((currentNotes) => [
      { ...noteToRestore },
      ...currentNotes.filter(
        (note) => !idsMatch(note, noteId),
      ),
    ])

    setSelectedNote(null)
  }

  function handleClearTrash() {
    if (trash.length === 0) return

    const confirmed = window.confirm(
      `Permanently delete all ${trash.length} notes in Trash? This action cannot be undone.`,
    )

    if (!confirmed) return

    setTrash([])
    setSelectedNote(null)
  }

  function handleToggleFavorite(noteOrId) {
    if (activeView === 'trash') return

    const noteId = getNoteId(noteOrId)

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        idsMatch(note, noteId)
          ? {
              ...note,
              isFavorite: !note.isFavorite,
            }
          : note,
      ),
    )
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
    .sort((a, b) =>
      sortOrder === 'newest'
        ? Number(b.id) - Number(a.id)
        : Number(a.id) - Number(b.id),
    )

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