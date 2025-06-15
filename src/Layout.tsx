import React, { useEffect, useState } from 'react';
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
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 600px) {
        img[alt="Home"],
        img[alt="Matchup History"],
        img[alt="Account"],
        img[alt="Login"] {
          height: 36px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.page}>
      {showBackground && <div style={styles.skyboxBackground} />}

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.sideSpace} />

          <button onClick={() => navigate(-1)} style={styles.backTextButton} title="Back" aria-label="Back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              fill="currentColor"
            >
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <nav style={styles.nav}>
            <button style={styles.iconButton} onClick={() => navigate('/')}>
              <img src={`${base}home.webp`} alt="Home" style={styles.iconImage} />
            </button>

            <button style={styles.iconButton} onClick={() => navigate('/history')}>
              <img src={`${base}matchhistory.webp`} alt="Matchup History" style={styles.iconImage} />
            </button>

            <div style={styles.dropdownContainer}>
              <button style={styles.iconButton} onClick={() => setShowDropdown(!showDropdown)}>
                <img
                  src={`${base}${user ? 'account.webp' : 'login.webp'}`}
                  alt={user ? 'Account' : 'Login'}
                  title={user ? 'Account' : 'Login'}
                  style={styles.iconImage}
                />
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

          <div style={styles.sideSpace} />
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>{children}</div>
      </main>

      <footer style={styles.footer}>
        <p>
          © 2025 NinetalesGames | v1.0.2 |{' '}
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
    backgroundImage: `url("${import.meta.env.BASE_URL}background.webp")`,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideSpace: {
    width: '40px',
    flexShrink: 0,
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
  backTextButton: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1002,
    padding: '4px',
    color: '#f1c40f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
    fontSize: '0',
    textShadow: '0 0 6px rgba(0, 0, 0, 0.9)',
  },
};
