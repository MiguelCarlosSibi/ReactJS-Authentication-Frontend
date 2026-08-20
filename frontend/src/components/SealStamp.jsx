const STATUS_COPY = {
  pending: 'AWAITING RECORD',
  checking: 'VERIFYING',
  granted: 'VERIFIED',
  denied: 'NOT VERIFIED',
}

/**
 * A circular registrar seal — the page's signature element. It's an open
 * ring on Register, spins subtly while Login checks credentials, and lands
 * as a filled, slightly-rotated "stamp" once the Dashboard confirms a
 * session — echoing a stamped enrollment card without literally copying one.
 */
export default function SealStamp({ status = 'pending', username }) {
  const filled = status === 'granted'
  const denied = status === 'denied'
  const initials = (username || 'A1')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 2)
    .toUpperCase() || 'A1'

  return (
    <div className={`seal seal--${status}`}>
      <svg viewBox="0 0 120 120" className="seal__svg" aria-hidden="true">
        <circle cx="60" cy="60" r="54" className="seal__ring-outer" />
        <circle cx="60" cy="60" r="44" className="seal__ring-inner" />
        {filled ? <circle cx="60" cy="60" r="44" className="seal__fill" /> : null}
        <text x="60" y="68" textAnchor="middle" className="seal__initials">
          {initials}
        </text>
        <path id="sealArc" d="M 60 60 m -50 0 a 50 50 0 1 1 100 0" fill="none" />
        <text className="seal__arc-text">
          <textPath href="#sealArc" startOffset="50%" textAnchor="middle">
            ACTIVITY01 · EST. RECORD SYSTEM
          </textPath>
        </text>
      </svg>
      <span className={`seal__label seal__label--${denied ? 'denied' : filled ? 'granted' : 'pending'}`}>
        {STATUS_COPY[status] ?? STATUS_COPY.pending}
      </span>
    </div>
  )
}
