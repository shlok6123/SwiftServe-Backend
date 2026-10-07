/**
 * Loader
 * A reusable animated loading indicator. Defaults to bouncing dots, with an
 * optional centered layout and label for full-section loading states.
 */
const Loader = ({ label = '', center = false, variant = 'dots' }) => {
  const indicator =
    variant === 'bar' ? (
      <span className="bar-loader" style={{ maxWidth: 220 }} />
    ) : (
      <span className="dot-loader" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    );

  const content = (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.85rem',
      }}
    >
      {indicator}
      {label && (
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {label}
        </span>
      )}
    </div>
  );

  if (!center) return content;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '40vh',
        width: '100%',
      }}
    >
      {content}
    </div>
  );
};

export default Loader;
