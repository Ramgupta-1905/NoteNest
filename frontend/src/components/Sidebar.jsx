import {
  NotebookPen,
  House,
  Star,
  Trash2,
  Sun,
  Moon,
} from 'lucide-react'

function Sidebar({
  notesCount,
  favoriteCount,
  trashCount = 0,
  activeView = 'all',
  onChangeView = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {},
}) {
  const navItems = [
    {
      id: 'all',
      label: 'All Notes',
      icon: House,
      count: notesCount,
    },
    {
      id: 'favorites',
      label: 'Favourites',
      icon: Star,
      count: favoriteCount,
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: Trash2,
      count: trashCount,
    },
  ]

  const sidebarTheme = isDarkMode
    ? 'border-slate-700/80 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/95 shadow-[7px_8px_18px_rgba(0,0,0,0.25)]'
    : 'border-white/90 bg-[linear-gradient(150deg,rgba(248,249,255,0.88)_0%,rgba(239,242,255,0.86)_50%,rgba(246,239,255,0.88)_100%)] shadow-[7px_8px_18px_rgba(111,124,161,0.13),-5px_-5px_14px_rgba(255,255,255,0.88),inset_1px_1px_3px_rgba(255,255,255,0.95)]'

  return (
    <aside
      className={`relative z-10 isolate flex shrink-0 flex-col overflow-hidden rounded-3xl border p-4 backdrop-blur-2xl transition-colors duration-300 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:min-h-0 lg:w-[220px] lg:self-start lg:p-5 ${sidebarTheme}`}
    >
      {/* Decorative sidebar bubbles */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-12 z-0 size-44 rounded-full blur-xl ${
          isDarkMode
            ? 'bg-[radial-gradient(circle,rgba(76,126,226,0.18)_0%,rgba(128,158,242,0.08)_52%,transparent_74%)]'
            : 'bg-[radial-gradient(circle,rgba(76,126,226,0.20)_0%,rgba(128,158,242,0.09)_52%,transparent_74%)]'
        }`}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-14 z-0 size-48 rounded-full bg-[radial-gradient(circle,rgba(137,99,219,0.18)_0%,rgba(176,150,243,0.08)_54%,transparent_75%)] blur-xl"
      />

      {/* App branding */}
      <div className="relative z-10 mb-6 flex items-center gap-3 lg:mb-8">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/30 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-[0_4px_10px_rgba(59,130,246,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]">
          <NotebookPen size={25} />
        </div>

        <div>
          <h2
            className={`text-lg font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#101944]'
            }`}
          >
            NoteNest
          </h2>

          <p
            className={`mt-0.5 text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Your thoughts, organized.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-row gap-2 sm:gap-3 lg:flex-col lg:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          const navTheme = isActive
            ? isDarkMode
              ? 'border-blue-400/30 bg-gradient-to-br from-blue-500/25 to-indigo-500/20 font-semibold text-blue-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
              : 'border-white/80 bg-gradient-to-br from-[#dce8ff] to-[#cbdcff] font-semibold text-blue-700 shadow-[5px_5px_11px_rgba(92,119,177,0.17),-4px_-4px_10px_rgba(255,255,255,0.88),inset_1px_1px_2px_rgba(255,255,255,0.9)]'
            : isDarkMode
              ? 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-white/5'
              : 'border-transparent text-slate-600 hover:border-white/70 hover:bg-white/45'

          const countTheme = isDarkMode
            ? isActive
              ? 'border-blue-400/30 bg-blue-400/15 text-blue-100'
              : 'border-slate-600 bg-slate-800/80 text-slate-300'
            : 'border-white/80 bg-white/65 text-slate-600'

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeView(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-0 flex-1 items-center gap-2 rounded-2xl border px-3 py-3 transition-colors duration-200 lg:gap-3 lg:px-3.5 ${navTheme}`}
            >
              <Icon size={19} className="shrink-0" />

              <span className="min-w-0 flex-1 truncate text-xs sm:text-sm">
                {item.label}
              </span>

              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${countTheme}`}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Functional theme toggle */}
      <button
        type="button"
        onClick={onToggleDarkMode}
        aria-label={
          isDarkMode
            ? 'Switch to light mode'
            : 'Switch to dark mode'
        }
        aria-pressed={isDarkMode}
        className={`relative z-10 mt-5 flex w-fit items-center justify-between gap-3 self-center rounded-full border px-4 py-3 shadow-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:mt-auto lg:w-full lg:self-auto ${
          isDarkMode
            ? 'border-slate-700 bg-slate-800/90 text-slate-300 shadow-black/10'
            : 'border-white/85 bg-white/55 text-slate-500 shadow-[0_3px_8px_rgba(49,68,115,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]'
        }`}
      >
        <Sun
          size={18}
          className={
            !isDarkMode
              ? 'text-amber-500'
              : 'text-slate-500'
          }
        />

        <span
          className={`relative h-6 w-11 rounded-full border p-[3px] transition-colors duration-300 ${
            isDarkMode
              ? 'border-blue-400/40 bg-gradient-to-r from-blue-600 to-indigo-600'
              : 'border-blue-300/60 bg-gradient-to-r from-blue-400 to-blue-500'
          }`}
        >
          <span
            className={`block size-[18px] rounded-full border border-white/90 bg-white shadow-[0_1px_3px_rgba(49,68,115,0.2)] transition-transform duration-300 ${
              isDarkMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </span>

        <Moon
          size={18}
          className={
            isDarkMode
              ? 'text-blue-300'
              : 'text-slate-400'
          }
        />
      </button>
    </aside>
  )
}

export default Sidebar