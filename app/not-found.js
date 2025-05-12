import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '0 1rem',
      backgroundColor: '#121212',
      color: '#ffffff'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
      <Link href="/" style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.375rem',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
      }}>
        Return Home
      </Link>
    </div>
  );
}
