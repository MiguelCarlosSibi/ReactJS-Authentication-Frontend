import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import SealStamp from '../components/SealStamp.jsx'
import Field from '../components/Field.jsx'
import Banner from '../components/Banner.jsx'
import { loginUser } from '../api/authApi.js'
import { saveSession } from '../api/session.js'

function validate(form) {
  const errors = {}
  if (!form.username.trim()) errors.username = 'Username is required.'
  if (!form.password) errors.password = 'Password is required.'
  return errors
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [status, setStatus] = useState('pending') // pending | checking | denied
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')

    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setStatus('checking')
    try {
      const user = await loginUser({ username: form.username.trim(), password: form.password })
      saveSession(user)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setStatus('denied')
      setServerError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Returning student"
      title="Sign in to your record."
      seal={<SealStamp status={status} username={form.username} />}
    >
      <Banner tone="error">{serverError}</Banner>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={fieldErrors.username}
          autoComplete="username"
          placeholder="jdelacruz"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
          placeholder="Your password"
        />

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? 'Verifying…' : 'Sign in'}
        </button>
      </form>

      <p className="card__switch">
        New here? <Link to="/register">Create a record</Link>
      </p>
    </AuthShell>
  )
}
