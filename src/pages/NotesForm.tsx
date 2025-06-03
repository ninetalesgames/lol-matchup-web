import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import { useSaveStatus } from '../components/SaveStatus';
import Layout from '../Layout';

export default function NotesForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playerChampion, opponentChampion, isEditing } = useParams<{
    playerChampion: string;
    opponentChampion: string;
    isEditing: string;
  }>();

  const [workedWell, setWorkedWell] = useState('');
  const [struggles, setStruggles] = useState('');
  const [itemsHelped, setItemsHelped] = useState('');
  const [rememberNext, setRememberNext] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [notes, setNotes] = useState<Record<string, any>>({});
  const { triggerCheck, SaveCheck } = useSaveStatus();

  const key = `${playerChampion}_${opponentChampion}`;

  useEffect(() => {
    const fetchNotes = async () => {
      const loadedNotes = await loadNotes(user);
      setNotes(loadedNotes);

      if (isEditing === 'true') {
        const note = loadedNotes[key];
        if (note) {
          setWorkedWell(note.workedWell);
          setStruggles(note.struggles);
          setItemsHelped(note.itemsHelped);
          setRememberNext(note.rememberNext);
          setDifficulty(note.difficulty);
        }
      }
    };
    fetchNotes();
  }, [isEditing, playerChampion, opponentChampion, user]);

  const handleSave = async () => {
    const updated = {
      ...notes,
      [key]: {
        ...notes[key],
        workedWell,
        struggles,
        itemsHelped,
        rememberNext,
        difficulty,
        wins: notes[key]?.wins || 0,
        losses: notes[key]?.losses || 0,
        lastUpdated: Date.now(),
      },
    };
    await saveNotes(user, updated);
    triggerCheck();

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const handleAddLaneResult = async (didWin: boolean) => {
    const current = notes[key] || {
      workedWell: '',
      struggles: '',
      itemsHelped: '',
      rememberNext: '',
      difficulty: 3,
      wins: 0,
      losses: 0,
    };

    const updated = {
      ...notes,
      [key]: {
        ...current,
        wins: didWin ? (current.wins || 0) + 1 : current.wins || 0,
        losses: !didWin ? (current.losses || 0) + 1 : current.losses || 0,
        lastUpdated: Date.now(),
      },
    };
    await saveNotes(user, updated);
    triggerCheck();

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>
          {playerChampion} vs {opponentChampion}
        </h1>

        <div style={styles.field}>
          <label>What worked well?</label>
          <input
            type="text"
            value={workedWell}
            onChange={(e) => setWorkedWell(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>What was hard?</label>
          <input
            type="text"
            value={struggles}
            onChange={(e) => setStruggles(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Helpful items/runes?</label>
          <input
            type="text"
            value={itemsHelped}
            onChange={(e) => setItemsHelped(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>What to remember next time?</label>
          <input
            type="text"
            value={rememberNext}
            onChange={(e) => setRememberNext(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Difficulty:</label>
          <div>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => setDifficulty(num)}
                style={{
                  fontSize: '28px',
                  margin: '0 4px',
                  cursor: 'pointer',
                  color: num <= difficulty ? 'gold' : '#555',
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div>
          <button style={styles.button} onClick={handleSave}>
            Save Changes
          </button>
          <SaveCheck />
        </div>

        <div style={{ marginTop: '20px' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Add Lane Result:
          </p>
          <button
            style={{ ...styles.button, backgroundColor: 'green' }}
            onClick={() => handleAddLaneResult(true)}
          >
            Won Lane
          </button>
          <button
            style={{ ...styles.button, backgroundColor: 'red' }}
            onClick={() => handleAddLaneResult(false)}
          >
            Lost Lane
          </button>
        </div>

        <button style={styles.backButton} onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  field: {
    marginBottom: '15px',
  },
  input: {
    width: '60%',
    padding: '8px',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  backButton: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#34495e',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};
