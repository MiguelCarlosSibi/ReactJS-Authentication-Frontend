import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import SealStamp from '../components/SealStamp.jsx'
import Field from '../components/Field.jsx'
import Banner from '../components/Banner.jsx'
import { registerUser } from '../api/authApi.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}

  if (!form.username.trim()) {
    errors.username = 'Username is required.'
  } else if (form.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!form.password) {
    errors.password = 'Password is required.'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

const EMPTY_FORM = { username: '', email: '', password: '', confirmPassword: '' }

export default function Register() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [successUser, setSuccessUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    setSuccessUser(null)

    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      const saved = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      setSuccessUser(saved)
      setForm(EMPTY_FORM)
    } catch (error) {
      setServerError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="New record"
      title="Open your record."
      seal={<SealStamp status={successUser ? 'granted' : 'pending'} username={successUser?.username || form.username} />}
    >
      <Banner tone="error">{serverError}</Banner>
      {successUser ? (
        <Banner tone="success">
          Record opened for <strong>{successUser.username}</strong>. You may log in now.
        </Banner>
      ) : null}

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
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
          placeholder="jdelacruz@example.com"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />
        <Field
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? 'Opening record…' : 'Submit'}
        </button>
      </form>

      <p className="card__switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  )
}
