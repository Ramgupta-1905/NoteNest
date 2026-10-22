
const API_URL = 'http://localhost:5000/api/notes';

// Fetch notes from the backend
export async function getNotes(view = 'active') {
  const url =
    view === 'trash'
      ? `${API_URL}?view=trash`
      : API_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch notes.');
  }

  return response.json();
}

// Create a note
export async function createNote(noteData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      color: noteData.color || 'blue',
      isFavorite: noteData.isFavorite ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create note.');
  }

  return response.json();
}

// Update an existing note
export async function updateNote(noteId, updatedData) {
  const response = await fetch(`${API_URL}/${noteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to update note.');
  }

  return response.json();
}

// Move a note to Trash
export async function deleteNote(noteId) {
  const response = await fetch(`${API_URL}/${noteId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to move note to Trash.');
  }

  return response.json();
}

// Restore a note from Trash
export async function restoreNote(noteId) {
  const response = await fetch(`${API_URL}/${noteId}/restore`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to restore note.');
  }

  return response.json();
}

// Permanently delete a note
export async function permanentlyDeleteNote(noteId) {
  const response = await fetch(`${API_URL}/${noteId}/permanent`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to permanently delete note.');
  }

  return response.json();
}

// Clear Trash
export async function clearTrash() {
  const response = await fetch(`${API_URL}/trash`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to clear Trash.');
  }

  return response.json();
}
