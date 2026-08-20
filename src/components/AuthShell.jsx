export default function AuthShell({ eyebrow, title, seal, children }) {
  return (
    <div className="page">
      <div className="page__texture" aria-hidden="true" />
      <div className="card">
        <div className="card__crest">{seal}</div>
        <span className="card__eyebrow">{eyebrow}</span>
        <h1 className="card__title">{title}</h1>
        <div className="card__rule" aria-hidden="true" />
        {children}
      </div>
      <p className="page__footnote">Backend · localhost:8080 · Spring Boot 4.1 / MySQL</p>
    </div>
  )
}
