import { useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import SealStamp from '../components/SealStamp.jsx'
import { getSession, clearSession } from '../api/session.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getSession()

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <AuthShell
      eyebrow="Session active"
      title={`Welcome, ${user?.username ?? 'student'}.`}
      seal={<SealStamp status="granted" username={user?.username} />}
    >
      <dl className="summary">
        <div className="summary__row">
          <dt>Record ID</dt>
          <dd>{user?.id ?? '—'}</dd>
        </div>
        <div className="summary__row">
          <dt>Username</dt>
          <dd>{user?.username ?? '—'}</dd>
        </div>
        <div className="summary__row">
          <dt>Email</dt>
          <dd>{user?.email ?? '—'}</dd>
        </div>
      </dl>

      <button className="button button--ghost" type="button" onClick={handleLogout}>
        Sign out
      </button>
    </AuthShell>
  )
}
