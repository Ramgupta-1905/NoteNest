
import { useState } from 'react'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  NotebookPen,
  UserRound,
  X,
} from 'lucide-react'
import BackgroundBubbles from '../BackgroundBubbles'

function AuthModal({ onSuccess }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (mode === 'signup') {
      if (name.trim().length < 2) {
        setError('Please enter your name.')
        return
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    // Demo only: real credential verification will be added with the backend.
    onSuccess()
  }

  const isSignup = mode === 'signup'

  return (
    <div className="w-full max-w-md">
      <div className="relative isolate my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-[#e8edfb] p-6 text-[#101944] shadow-[0_25px_80px_rgba(20,35,80,0.28)] sm:p-8">
        <BackgroundBubbles />

        <div className="relative z-10">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-200">
                <NotebookPen size={25} />
              </div>

              <div>
                <h1 className="text-xl font-extrabold">NoteNest</h1>
                <p className="mt-0.5 text-xs text-slate-500">
                  Your thoughts, organized.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setError('Please sign in or create an account to continue.')}
              aria-label="Authentication required"
              title="Sign in to continue"
              className="grid size-9 place-items-center rounded-full border border-white/80 bg-white/60 text-slate-500"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/80 bg-white/45 p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                !isSignup
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                isSignup
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isSignup
                ? 'Create an account to organize your notes.'
                : 'Sign in to continue to your notes.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="auth-name" className="mb-1.5 block text-sm font-semibold">
                  Full name
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-white bg-white/65 px-3 shadow-inner focus-within:ring-2 focus-within:ring-blue-200">
                  <UserRound size={17} className="shrink-0 text-slate-400" />
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    minLength={2}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-sm font-semibold">
                Email address
              </label>

              <div className="flex h-11 items-center gap-3 rounded-xl border border-white bg-white/65 px-3 shadow-inner focus-within:ring-2 focus-within:ring-blue-200">
                <Mail size={17} className="shrink-0 text-slate-400" />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-sm font-semibold">
                Password
              </label>

              <div className="flex h-11 items-center gap-3 rounded-xl border border-white bg-white/65 px-3 shadow-inner focus-within:ring-2 focus-within:ring-blue-200">
                <LockKeyhole size={17} className="shrink-0 text-slate-400" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={isSignup ? 8 : undefined}
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="shrink-0 text-slate-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label htmlFor="auth-confirm-password" className="mb-1.5 block text-sm font-semibold">
                  Confirm password
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-white bg-white/65 px-3 shadow-inner focus-within:ring-2 focus-within:ring-blue-200">
                  <LockKeyhole size={17} className="shrink-0 text-slate-400" />
                  <input
                    id="auth-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-600 hover:to-blue-700"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
            {isSignup
              ? 'By continuing, you agree to use Notes App responsibly.'
              : 'Your workspace for thoughts, ideas and everyday plans.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
