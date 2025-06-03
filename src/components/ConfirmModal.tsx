import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonGroup}>
          <button style={{ ...styles.button, backgroundColor: 'green' }} onClick={onConfirm}>
            Yes
          </button>
          <button style={{ ...styles.button, backgroundColor: 'gray' }} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#2c3140',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  message: {
    marginBottom: '20px',
    fontSize: '16px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
