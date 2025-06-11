import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginDropdown from './components/LoginDropdown';
import { saveNotes } from './services/DataService';

export default function Layout({
  children,
  showBackground = true,
}: {
  children: React.ReactNode;
  showBackground?: boolean;
}) {  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const base = import.meta.env.BASE_URL;

  return (
    <div style={styles.page}>
      {/* Global background image */}
{showBackground && <div style={styles.skyboxBackground} />}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          
          <nav style={styles.nav}>
            <button style={styles.iconButton} onClick={() => navigate('/')}>
              <img src={`${base}home.png`} alt="Home" style={styles.iconImage} />
            </button>

            <button style={styles.iconButton} onClick={() => navigate('/history')}>
              <img src={`${base}matchhistory.png`} alt="Matchup History" style={styles.iconImage} />
            </button>

            <div style={styles.dropdownContainer}>
              <button style={styles.iconButton} onClick={() => setShowDropdown(!showDropdown)}>
                <img src={`${base}account.png`} alt="Account" title="Account" style={styles.iconImage} />
              </button>

              {showDropdown && (
                <div style={styles.dropdownMenu}>
                  {user ? (
                    <>
                      <div style={styles.dropdownItem}>Signed in as: {user.email}</div>
                      <button
                        style={styles.dropdownItem}
                        onClick={async () => {
                          const confirmed = window.confirm('Are you sure you want to delete all saved notes?');
                          if (confirmed) {
                            localStorage.clear();
                            await saveNotes(user, {});
                            window.location.reload();
                          }
                        }}
                      >
                        🔄 Reset All Notes
                      </button>
                      <button style={styles.dropdownItem} onClick={logout}>
                        🚪 Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <LoginDropdown onClose={() => setShowDropdown(false)} />
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                      >
                        🔄 Reset All Notes
                      </button>
                    </>
                  )}
                  <div style={styles.dropdownDivider} />
                  <div style={styles.dropdownItem}>🌐 Language: English</div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>{children}</div>
      </main>

      <footer style={styles.footer}>
        <p>
          © 2025 NinetalesGames | v1.0.1 |{' '}
          <a href={`${base}privacy.html`} style={styles.link}>
            Privacy Policy
          </a>{' '}
          |{' '}
          <a href="mailto:ninetales@ninetalesgames.co.uk" style={styles.link}>
            Send Feedback
          </a>
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
    backgroundColor: 'transparent',
    color: '#fff',
    fontFamily: "'Cinzel', serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  skyboxBackground: {
    backgroundImage: `url("${import.meta.env.BASE_URL}background.png")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundBlendMode: 'overlay',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    opacity: 0.8,
    filter: 'brightness(1)',
  },
  header: {
    backgroundColor: 'rgba(20, 20, 20, 0.2)',
    padding: '6px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))',
  },
  logoImage: {
    height: '60px',
    objectFit: 'contain',
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
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#222',
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '10px',
    minWidth: '200px',
    zIndex: 1001,
    marginTop: '5px',
  },
  dropdownItem: {
    background: 'none',
    border: 'none',
    color: '#fff',
    textAlign: 'left',
    width: '100%',
    padding: '8px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#444',
    margin: '8px 0',
  },
  main: {
    flex: 1,
    padding: '20px 0',
  },
  content: {
    width: '100%',
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
  iconButton: {
    background: 'none',
    border: 'none',
    margin: '0 4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    height: '50px',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))',
  },
};
