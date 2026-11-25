export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#05070A',
      color: '#F0F4F8',
      fontFamily: "'DM Mono', monospace",
      textAlign: 'center',
      padding: 24,
    }}>
      <div>
        <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 34, margin: 0 }}>
          Home
        </h1>
        <p style={{ color: '#7C8899', marginTop: 10 }}>
          Aqui va tu dashboard despues del login
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <a href="/login" style={{ color: '#38BDF8', textDecoration: 'none' }}>← Login</a>
          <a href="/register" style={{ color: '#00AA88', textDecoration: 'none' }}>Crear cuenta →</a>
        </div>
      </div>
    </div>
  );
}