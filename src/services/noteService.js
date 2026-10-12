export function createNote(notes, noteData) {
  const newNote = {
    id: Date.now(),
    title: noteData.title.trim(),
    content: noteData.content.trim(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    color: noteData.color || 'blue',
    isFavorite: noteData.isFavorite ?? false,
  }

  return [...notes, newNote]
}

export function getNotes(notes) {
  return notes
}

export function updateNote(notes, noteId, updatedData) {
  return notes.map((note) =>
    String(note.id) === String(noteId)
      ? { ...note, ...updatedData }
      : note,
  )
}

export function deleteNote(notes, noteId) {
  return notes.filter(
    (note) => String(note.id) !== String(noteId),
  )
}