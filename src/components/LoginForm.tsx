import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function LoginForm() {
  const { user, login, signup, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Authentication failed. Please check your details.');
    }
  };

  return (
    <div style={styles.container}>
      {user ? (
        <div>
          <p>Logged in as <strong>{user.email}</strong></p>
          <button style={styles.button} onClick={logout}>Log Out</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{mode === 'login' ? 'Log In' : 'Sign Up'}</h2>
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
          <button type="submit" style={styles.button}>
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
          <button
            type="button"
            style={styles.toggleButton}
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Need an account? Sign Up' : 'Have an account? Log In'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'inline-block',
    textAlign: 'left',
    backgroundColor: '#2c3140',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #444',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#34495e',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};
