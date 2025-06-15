import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';

export default function LoginDropdown({ onClose }: { onClose: () => void }) {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      await signup(email, password);
    } else {
      await login(email, password);
    }
    onClose();
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Inject CSS animation if not already in the page
  useEffect(() => {
    const styleId = 'login-dropdown-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-animate {
          animation: fadeSlide 0.25s ease-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={styles.wrapper} ref={dropdownRef}>
      <div style={styles.caret} />
      <div className="dropdown-animate" style={styles.dropdown}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.submitButton}>
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
          <button
            type="button"
            style={styles.toggleButton}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Have an account? Log In' : 'Need an account? Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'absolute',
    top: '120px',
    right: '12px',
    zIndex: 1001,
  },
  caret: {
    position: 'absolute',
    top: '-8px',
    right: '20px',
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '8px solid #2c3140',
  },
  dropdown: {
    backgroundColor: '#2c3140',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
    padding: '14px',
    width: '240px',
    opacity: 0, // will be overridden by animation
    animationFillMode: 'forwards',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  toggleButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    color: '#ccc',
    border: 'none',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'center',
  },
};
