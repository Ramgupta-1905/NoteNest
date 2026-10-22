import {
  CalendarDays,
  Star,
  Trash2,
  RotateCcw,
  Eye,
} from 'lucide-react'

import { cardColors, bubbleColors } from '../data/initialNotes'

function NoteCard({
  note,
  onToggleFavorite,
  onDelete,
  onRestore,
  onView,
  isTrash = false,
  isDarkMode = false,
}) {
  const colors = bubbleColors[note.color] || bubbleColors.blue

  const cardTheme = isDarkMode
    ? 'border-slate-700/70 shadow-[7px_8px_15px_rgba(0,0,0,0.20)] hover:border-slate-500/80 hover:shadow-[9px_11px_18px_rgba(0,0,0,0.28)]'
    : 'border-white/95 shadow-[7px_8px_15px_rgba(111,124,161,0.14),-5px_-5px_12px_rgba(255,255,255,0.92),inset_1px_1px_3px_rgba(255,255,255,0.35)] hover:border-white hover:shadow-[9px_11px_18px_rgba(111,124,161,0.17),-6px_-6px_14px_rgba(255,255,255,0.96),inset_1px_1px_3px_rgba(255,255,255,0.40)]'

  const titleTheme = 'text-[#101944]'

  const contentTheme = 'text-slate-600'

  const dateTheme = 'text-slate-600'

  const actionShadow = isDarkMode
    ? 'shadow-sm shadow-black/10'
    : 'shadow-[4px_4px_8px_rgba(116,133,177,0.18),-3px_-3px_8px_rgba(255,255,255,0.95)]'

  function handleCardClick() {
    if (onView) {
      onView(note)
    }
  }

  function handleCardKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick()
    }
  }

  function handleFavoriteClick(event) {
    event.stopPropagation()
    onToggleFavorite(note.id)
  }

  function handleDeleteClick(event) {
    event.stopPropagation()
    onDelete(note.id)
  }

  function handleRestoreClick(event) {
    event.stopPropagation()
    onRestore(note.id)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View note: ${note.title}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      style={cardColors[note.color] || cardColors.blue}
      className={`group relative isolate flex min-h-[190px] min-w-0 cursor-pointer flex-col overflow-hidden rounded-3xl border p-5 transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${cardTheme}`}
    >
      {/* Decorative color bubbles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 z-0 size-36 rounded-full blur-[1px]"
        style={{
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 72%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-5 z-0 size-36 rounded-full blur-[1px]"
        style={{
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 72%)`,
        }}
      />

      {/* Title and favourite */}
      <div className="relative z-10 mb-3 flex min-w-0 items-start gap-3">
        <h3
          className={`min-w-0 flex-1 break-words pt-1 text-base font-bold leading-snug ${titleTheme}`}
        >
          {note.title}
        </h3>

        {!isTrash && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={
              note.isFavorite
                ? `Remove ${note.title} from favourites`
                : `Add ${note.title} to favourites`
            }
            aria-pressed={Boolean(note.isFavorite)}
            title={
              note.isFavorite
                ? 'Remove from favourites'
                : 'Add to favourites'
            }
            className={`relative z-20 mt-1 grid size-7 shrink-0 place-items-center rounded-full border-0 bg-transparent p-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
              note.isFavorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-500 hover:text-amber-500'
            }`}
          >
            <Star
              size={17}
              strokeWidth={1.8}
              fill={note.isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      {/* Short content preview */}
      <p
        className={`relative z-10 mb-4 overflow-hidden break-words text-[13px] leading-relaxed [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] ${contentTheme}`}
      >
        {note.content}
      </p>

      {/* Date and bottom actions */}
      <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-500/20 pt-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs ${dateTheme}`}
        >
          <CalendarDays size={14} />
          {note.date}
        </span>

        <div className="flex items-center gap-2">
          {isTrash ? (
            <>
              <button
                type="button"
                onClick={handleRestoreClick}
                aria-label={`Restore ${note.title}`}
                title="Restore note"
                className={`relative z-20 grid size-9 place-items-center rounded-full border border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 transition-shadow hover:shadow-md ${actionShadow}`}
              >
                <RotateCcw size={14} />
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
                aria-label={`Permanently delete ${note.title}`}
                title="Delete permanently"
                className={`relative z-20 grid size-9 place-items-center rounded-full border border-rose-500/20 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 transition-shadow hover:shadow-md ${actionShadow}`}
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/45 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-white/75">
              <Eye size={14} />
              View note
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default NoteCard