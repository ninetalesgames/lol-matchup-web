import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function LoginDropdown({ onClose }: { onClose: () => void }) {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

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

  return (
    <div style={styles.dropdown}>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
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
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  dropdown: {
    position: 'absolute',
    top: '40px',
    right: 0,
    backgroundColor: '#2c3140',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
    width: '200px',
    zIndex: 1001,
  },
  input: {
    width: '100%',
    padding: '6px',
    marginBottom: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  submitButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '6px',
  },
  toggleButton: {
    width: '100%',
    padding: '6px',
    backgroundColor: 'transparent',
    color: '#ccc',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
