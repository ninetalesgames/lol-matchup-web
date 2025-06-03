import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginDropdown from './components/LoginDropdown';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo} onClick={() => navigate('/')}>
            LoL Matchup Master
          </div>
          <nav style={styles.nav}>
            <button style={styles.navButton} onClick={() => navigate('/')}>
              Home
            </button>
            <button style={styles.navButton} onClick={() => navigate('/history')}>
              Matchup History
            </button>

            {user ? (
              <div style={styles.userSection}>
                <span style={{ marginRight: '10px' }}>👤 {user.email}</span>
                <button style={styles.navButton} onClick={logout}>
                  Log Out
                </button>
              </div>
            ) : (
              <div style={styles.dropdownContainer}>
                <button
                  style={styles.navButton}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Log In / Sign Up
                </button>
                {showDropdown && <LoginDropdown onClose={() => setShowDropdown(false)} />}
              </div>
            )}
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          {children}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>
          © 2025 NinetalesGames | v1.0.1 |{' '}
          <a href="/privacy.html" style={styles.link}>Privacy Policy</a> |{' '}
          <a href="mailto:ninetales@ninetalesgames.co.uk" style={styles.link}>Send Feedback</a>
        </p>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#1a1f2e',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
  },
  header: {
    backgroundColor: '#2c3140',
    padding: '10px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navButton: {
    padding: '8px 16px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  dropdownContainer: {
    position: 'relative',
  },
  main: {
    flex: 1,
    padding: '20px 0',
  },
  content: {
    width: '100%',
    padding: '0 40px', // spacing from edges of window
    boxSizing: 'border-box',
  },
  footer: {
    padding: '10px 20px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#aaa',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: '#8e44ad',
    textDecoration: 'none',
  },
};
