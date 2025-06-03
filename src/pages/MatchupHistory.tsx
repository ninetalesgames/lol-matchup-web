import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import Layout from '../Layout';

type MatchupNote = {
  workedWell: string;
  struggles: string;
  itemsHelped: string;
  rememberNext: string;
  difficulty: number;
  wins?: number;
  losses?: number;
};

export default function MatchupHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Record<string, MatchupNote>>({});
  const [search, setSearch] = useState<string>('');
  const [sortMode, setSortMode] = useState<'default' | 'best' | 'worst'>('default');

  useEffect(() => {
    const fetchNotes = async () => {
      const savedNotes = await loadNotes(user);
      setNotes(savedNotes);
    };
    fetchNotes();
  }, [user]);

  const filteredKeys = Object.keys(notes).filter((key) =>
    key.toLowerCase().includes(search.toLowerCase())
  );

  const sortedKeys = [...filteredKeys].sort((a, b) => {
    const aNote = notes[a];
    const bNote = notes[b];
    const aTotal = (aNote.wins || 0) + (aNote.losses || 0);
    const bTotal = (bNote.wins || 0) + (bNote.losses || 0);
    const aWinrate = aTotal > 0 ? aNote.wins! / aTotal : 0;
    const bWinrate = bTotal > 0 ? bNote.wins! / bTotal : 0;

    if (sortMode === 'best') return bWinrate - aWinrate;
    if (sortMode === 'worst') return aWinrate - bWinrate;
    return 0;
  });

  const deleteNote = async (key: string) => {
    const updated = { ...notes };
    delete updated[key];
    setNotes(updated);
    await saveNotes(user, updated);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Matchup History</h1>

        <input
          type="text"
          placeholder="Search by champion..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <div style={styles.sortContainer}>
          <label>Sort by:</label>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as 'default' | 'best' | 'worst')}
            style={styles.select}
          >
            <option value="default">Default</option>
            <option value="best">Best Winrate</option>
            <option value="worst">Worst Winrate</option>
          </select>
        </div>

        {sortedKeys.length === 0 ? (
          <p>No saved matchups yet.</p>
        ) : (
          sortedKeys.map((key) => {
            const [player, opponent] = key.split('_');
            const note = notes[key];
            const wins = note.wins || 0;
            const losses = note.losses || 0;
            const total = wins + losses;
            const winrate = total > 0 ? Math.round((wins / total) * 100) : null;

            const greenWidth = total > 0 ? (wins / total) * 100 : 0;
            const redWidth = 100 - greenWidth;

            return (
              <div key={key} style={styles.card}>
                <div
                  style={{ flex: 1, cursor: 'pointer' }}
                  onClick={() =>
                    navigate(`/notes/${player}/${opponent}/true`)
                  }
                >
                  <strong>
                    {player} vs {opponent}
                  </strong>
                  <p style={styles.stars}>
                    {'★'.repeat(note.difficulty)}{'☆'.repeat(5 - note.difficulty)}
                  </p>
                  <p>{note.rememberNext}</p>
                  {total > 0 && (
                    <>
                      <p style={styles.winrate}>
                        Winrate: {winrate}% ({wins}W / {losses}L)
                      </p>
                      <div style={styles.barContainer}>
                        <div style={{ ...styles.greenBar, width: `${greenWidth}%` }} />
                        <div style={{ ...styles.redBar, width: `${redWidth}%` }} />
                      </div>
                    </>
                  )}
                </div>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteNote(key)}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}

        <button style={styles.backButton} onClick={() => navigate('/')}>
          Back to Champion Select
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
  search: {
    padding: '10px',
    borderRadius: '20px',
    width: '60%',
    marginBottom: '20px',
    border: '1px solid #ccc',
  },
  sortContainer: {
    marginBottom: '20px',
  },
  select: {
    marginLeft: '10px',
    padding: '6px',
    borderRadius: '6px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c3140',
    padding: '10px',
    margin: '10px auto',
    width: '80%',
    borderRadius: '10px',
    border: '1px solid #444',
  },
  stars: {
    fontSize: '16px',
    color: 'gold',
    margin: '4px 0',
  },
  winrate: {
    fontSize: '14px',
    color: '#aaa',
    margin: '4px 0',
  },
  barContainer: {
    display: 'flex',
    height: '10px',
    width: '100%',
    borderRadius: '5px',
    overflow: 'hidden',
    marginTop: '6px',
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
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#34495e',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};
