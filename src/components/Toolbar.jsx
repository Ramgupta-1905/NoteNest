import { Plus, Search, Trash2 } from 'lucide-react'

function Toolbar({
  search,
  onSearchChange,
  sortOrder,
  onSortChange,
  onCreateNote,
  onClearTrash,
  isTrash = false,
  isDarkMode = false,
}) {
  const controlTheme = isDarkMode
    ? 'border-slate-700 bg-slate-900/85 text-slate-200 shadow-md shadow-black/10'
    : 'border-white/85 bg-[#eef2ff]/85 text-slate-700 shadow-[6px_6px_14px_rgba(133,145,183,0.16),-5px_-5px_12px_rgba(255,255,255,0.92),inset_1px_1px_2px_rgba(255,255,255,0.9)]'

  return (
    <header className="mb-7 flex flex-wrap items-center gap-3 lg:gap-4">
      {/* Search */}
      <div
        className={`flex h-12 min-w-0 flex-1 basis-full items-center gap-3 rounded-2xl border px-4 backdrop-blur-xl transition-colors focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/15 sm:basis-auto ${controlTheme}`}
      >
        <Search
          size={19}
          className={`shrink-0 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-400'
          }`}
        />

        <input
          type="search"
          placeholder="Search notes by title or content..."
          aria-label="Search notes"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className={`w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400 ${
            isDarkMode ? 'text-slate-100' : 'text-slate-800'
          }`}
        />
      </div>

      {/* Sorting */}
      <select
        aria-label="Sort notes"
        value={sortOrder}
        onChange={(event) => onSortChange(event.target.value)}
        className={`h-12 min-w-0 flex-1 cursor-pointer rounded-2xl border px-3 text-sm outline-none transition-colors focus:border-blue-400 sm:flex-none sm:px-4 ${controlTheme}`}
      >
        <option value="newest">Oldest First</option>
        <option value="oldest">Newest First</option>
      </select>

      {/* Toolbar action */}
      {isTrash ? (
        <button
          type="button"
          onClick={onClearTrash}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-gradient-to-br from-red-500 to-rose-600 px-4 font-semibold text-white shadow-md transition-colors hover:from-red-600 hover:to-rose-700 active:brightness-95 sm:px-5"
        >
          <Trash2 size={19} />
          <span className="text-sm">Clear Trash</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreateNote}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-blue-400/40 bg-gradient-to-br from-blue-500 to-blue-600 px-4 font-semibold text-white shadow-md transition-colors hover:from-blue-600 hover:to-blue-700 active:brightness-95 sm:px-5"
        >
          <Plus size={19} />
          <span className="text-sm">New Note</span>
        </button>
      )}
    </header>
  )
}

export default Toolbar