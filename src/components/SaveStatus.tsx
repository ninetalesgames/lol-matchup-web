import { useState } from 'react';

export function useSaveStatus() {
  const [showCheck, setShowCheck] = useState(false);

  const triggerCheck = () => {
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 1500); // show for 1.5 seconds
  };

  const SaveCheck = () =>
    showCheck ? (
      <span style={{
        marginLeft: '10px',
        color: 'limegreen',
        fontSize: '14px',
        fontWeight: 'bold',
      }}>
        Saved!
      </span>
    ) : null;

  return { triggerCheck, SaveCheck };
}
