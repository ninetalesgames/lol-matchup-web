import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import Layout from '../Layout';
import ConfirmModal from '../components/ConfirmModal';
import championsData from '../assets/champions.json';

type MatchupNote = {
  workedWell: string;
  struggles: string;
  itemsHelped: string;
  rememberNext: string;
  difficulty: number;
  wins?: number;
  losses?: number;
};

export default function MatchupDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playerChampion, opponentChampion } = useParams<{
    playerChampion: string;
    opponentChampion: string;
  }>();

  const [notes, setNotes] = useState<Record<string, MatchupNote>>({});
  const [showModal, setShowModal] = useState(false);
  const [pendingResult, setPendingResult] = useState<'win' | 'loss' | null>(null);
  const key = `${playerChampion}_${opponentChampion}`;
  const opponentData = championsData.find((c) => c.name === opponentChampion);

  useEffect(() => {
    const fetchNotes = async () => {
      const savedNotes = await loadNotes(user);
      setNotes(savedNotes);
    };
    fetchNotes();
  }, [user]);

  const handleLaneResult = (result: 'win' | 'loss') => {
    setPendingResult(result);
    setShowModal(true);
  };

  const confirmLaneResult = async () => {
    if (!pendingResult) return;

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
        wins: pendingResult === 'win' ? (current.wins || 0) + 1 : current.wins || 0,
        losses: pendingResult === 'loss' ? (current.losses || 0) + 1 : current.losses || 0,
        lastUpdated: Date.now(),
      },
    };
    await saveNotes(user, updated);

    const refreshedNotes = await loadNotes(user);
    setNotes(refreshedNotes);

    setShowModal(false);
    setPendingResult(null);
  };

  const handleEditWinrate = async () => {
    const winInput = prompt('Enter updated wins:');
    const lossInput = prompt('Enter updated losses:');

    if (winInput === null || lossInput === null) return;

    const newWins = parseInt(winInput, 10);
    const newLosses = parseInt(lossInput, 10);

    if (isNaN(newWins) || isNaN(newLosses)) {
      alert('Invalid input. Please enter numbers.');
      return;
    }

    const updated = {
      ...notes,
      [key]: {
        ...notes[key],
        wins: newWins,
        losses: newLosses,
        lastUpdated: Date.now(),
      },
    };
    await saveNotes(user, updated);
    const refreshedNotes = await loadNotes(user);
    setNotes(refreshedNotes);
  };

  const renderStars = (count: number) =>
    '★'.repeat(count) + '☆'.repeat(5 - count);

  const note = notes[key];
  const wins = note?.wins || 0;
  const losses = note?.losses || 0;
  const total = wins + losses;
  const winrate = total > 0 ? Math.round((wins / total) * 100) : null;

  const greenWidth = total > 0 ? (wins / total) * 100 : 0;
  const redWidth = 100 - greenWidth;

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>
          {playerChampion} vs {opponentChampion}
        </h1>

        {note ? (
          <div>
            <h2 style={styles.sectionTitle}>What worked well?</h2>
            <p>{note.workedWell}</p>

            <h2 style={styles.sectionTitle}>What was hard?</h2>
            <p>{note.struggles}</p>

            <h2 style={styles.sectionTitle}>Helpful items/runes?</h2>
            <p>{note.itemsHelped}</p>

            <h2 style={styles.sectionTitle}>What to remember next time?</h2>
            <p>{note.rememberNext}</p>

            <h2 style={styles.sectionTitle}>Difficulty:</h2>
            <p style={styles.stars}>{renderStars(note.difficulty)}</p>

            {total > 0 && (
              <div>
                <p style={styles.winrate}>
                  Winrate: {winrate}% ({wins}W / {losses}L)
                </p>
                <div style={styles.barContainer}>
                  <div style={{ ...styles.greenBar, width: `${greenWidth}%` }} />
                  <div style={{ ...styles.redBar, width: `${redWidth}%` }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>[No notes saved yet]</p>
        )}

        <h2 style={styles.sectionTitle}>Exclusive Matchup Insights:</h2>
        <p>{opponentData ? opponentData.genericTips : '[No tips available]'}</p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.button}
            onClick={() =>
              navigate(`/notes/${playerChampion}/${opponentChampion}/${!!note}`)
            }
          >
            {note ? 'Edit Notes' : 'Add Notes'}
          </button>

          <button
            style={{ ...styles.button, backgroundColor: 'green' }}
            onClick={() => handleLaneResult('win')}
          >
            Won Lane
          </button>

          <button
            style={{ ...styles.button, backgroundColor: 'red' }}
            onClick={() => handleLaneResult('loss')}
          >
            Lost Lane
          </button>

          <button
            style={{ ...styles.button, backgroundColor: '#555' }}
            onClick={handleEditWinrate}
          >
            Edit Winrate
          </button>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate(`/opponent/${playerChampion}`)}
        >
          Back to Opponent Select
        </button>

        <ConfirmModal
          isOpen={showModal}
          message={
            pendingResult === 'win'
              ? "Did you *really* win lane? Or are you just coping?"
              : "You *really* lost lane? No shame, but let's be honest!"
          }
          onConfirm={confirmLaneResult}
          onCancel={() => {
            setShowModal(false);
            setPendingResult(null);
          }}
        />
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
  sectionTitle: {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  stars: {
    fontSize: '20px',
    color: 'gold',
  },
  winrate: {
    fontSize: '14px',
    color: '#aaa',
    marginTop: '10px',
  },
  barContainer: {
    display: 'flex',
    height: '10px',
    width: '80%',
    margin: '0 auto 10px',
    borderRadius: '5px',
    overflow: 'hidden',
    backgroundColor: '#555',
  },
  greenBar: {
    backgroundColor: 'green',
    height: '100%',
  },
  redBar: {
    backgroundColor: 'red',
    height: '100%',
  },
  buttonGroup: {
    marginTop: '20px',
  },
  button: {
    margin: '5px',
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
