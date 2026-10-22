import { Plus, Search } from 'lucide-react'
import NoteCard from './NoteCard'

function NotesGrid({
  notes,
  onToggleFavorite,
  onEditNote,
  onDeleteNote,
  onCreateNote,
  onRestoreNote,
  onViewNote,
  isTrash = false,
  isDarkMode = false,
}) {
  const emptyStateTheme = isDarkMode
    ? 'border-slate-700 bg-slate-900/70 shadow-black/10'
    : 'border-white/80 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]'

  const createCardTheme = isDarkMode
    ? 'border-slate-600 bg-slate-900/60 shadow-lg shadow-black/10 hover:border-blue-400/60 hover:bg-slate-800/80'
    : 'border-blue-200/90 bg-[#eef2ff]/65 shadow-[7px_7px_16px_rgba(124,137,174,0.12),-6px_-6px_14px_rgba(255,255,255,0.78),inset_1px_1px_2px_rgba(255,255,255,0.9)] hover:border-blue-300 hover:bg-white/45'

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEditNote}
            onDelete={onDeleteNote}
            onRestore={onRestoreNote}
            onView={onViewNote}
            isTrash={isTrash}
            isDarkMode={isDarkMode}
          />
        ))
      ) : (
        <div
          className={`col-span-full rounded-3xl border p-8 text-center ${emptyStateTheme}`}
        >
          <Search
            className="mx-auto mb-3 text-slate-400"
            size={25}
          />

          <p
            className={`text-sm font-semibold ${
              isDarkMode ? 'text-slate-200' : 'text-slate-600'
            }`}
          >
            {isTrash ? 'Trash is empty' : 'No notes found'}
          </p>

          <p
            className={`mt-1 text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {isTrash
              ? 'Notes you move to Trash will appear here.'
              : 'Try another search or create a new note.'}
          </p>
        </div>
      )}

      {!isTrash && (
        <button
          type="button"
          onClick={onCreateNote}
          className={`group flex min-h-[165px] min-w-0 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed p-4 text-center transition-colors ${createCardTheme}`}
        >
          <span
            className={`grid size-12 place-items-center rounded-2xl border text-blue-500 transition-colors ${
              isDarkMode
                ? 'border-slate-600 bg-slate-800 group-hover:bg-slate-700'
                : 'border-white/85 bg-white/55 text-blue-600 shadow-[0_3px_7px_rgba(49,68,115,0.055),inset_0_1px_0_rgba(255,255,255,0.95)] group-hover:bg-white/80'
            }`}
          >
            <Plus size={25} strokeWidth={1.8} />
          </span>

          <strong
            className={`text-sm font-bold ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            Create a new note
          </strong>

          <span
            className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Capture a thought or idea
          </span>
        </button>
      )}
    </div>
  )
}

export default NotesGrid