import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import Layout from '../Layout';

export default function MatchupHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Record<string, any>>({});
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<'default' | 'best' | 'worst'>('default');

  useEffect(() => {
    const fetchNotes = async () => {
      const saved = await loadNotes(user);
      setNotes(saved);
    };
    fetchNotes();
  }, [user]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes jiggle {
        0% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        50% { transform: translateX(2px); }
        75% { transform: translateX(-2px); }
        100% { transform: translateX(0); }
      }
      .matchup-jiggle:hover {
        animation: jiggle 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const filteredKeys = Object.keys(notes).filter((key) =>
    key.toLowerCase().includes(search.toLowerCase())
  );

  const sortedKeys = [...filteredKeys].sort((a, b) => {
    const aNote = notes[a];
    const bNote = notes[b];
    const aTotal = (aNote.wins || 0) + (aNote.losses || 0);
    const bTotal = (bNote.wins || 0) + (bNote.losses || 0);
    const aWinrate = aTotal > 0 ? aNote.wins / aTotal : 0;
    const bWinrate = bTotal > 0 ? bNote.wins / bTotal : 0;

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
    <>
      <div style={styles.backgroundImage} />

      <div style={styles.contentWrapper}>
        <div style={styles.overlay}>
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
                    <div
                      key={key}
                      className="matchup-jiggle"
                      style={styles.card}
                      onClick={() => navigate(`/matchup/${player}/${opponent}`)}
                    >
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${player}.png`}
                        alt={player}
                        style={styles.championIcon}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                          {player} vs {opponent}
                        </div>
                        <div style={styles.winrateText}>
                          {total} Games | Winrate: {winrate}% ({wins}W / {losses}L)
                        </div>
                        <div style={styles.barContainer}>
                          <div style={{ ...styles.greenBar, width: `${greenWidth}%` }} />
                          <div style={{ ...styles.redBar, width: `${redWidth}%` }} />
                        </div>
                      </div>
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${opponent}.png`}
                        alt={opponent}
                        style={styles.championIcon}
                      />
                      <button
                        style={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(key);
                        }}
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
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  backgroundImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    backgroundImage:
      'url("https://raw.communitydragon.org/latest/game/assets/maps/skyboxes/riots_sru_skybox_cubemap.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    opacity: 0.9,
    filter: 'brightness(1)',
    pointerEvents: 'none',
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  overlay: {
    position: 'relative',
    zIndex: 2,
    padding: '20px',
    background: 'rgba(10, 10, 10, 0.2)',
  },
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
    backgroundColor: '#1e1e2e',
    padding: '12px 18px',
    margin: '12px auto',
    width: '90%',
    maxWidth: '600px',
    borderRadius: '30px',
    border: '1px solid #444',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
  },
  championIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    margin: '0 10px',
    border: '1px solid #666',
    flexShrink: 0,
  },
  winrateText: {
    fontSize: '14px',
    color: '#ccc',
    marginBottom: '6px',
  },
  barContainer: {
    display: 'flex',
    height: '8px',
    width: '100%',
    borderRadius: '999px',
    overflow: 'hidden',
    backgroundColor: '#444',
  },
  greenBar: {
    backgroundColor: '#2ecc71',
    height: '100%',
    transition: 'width 0.3s ease',
  },
  redBar: {
    backgroundColor: '#e74c3c',
    height: '100%',
    transition: 'width 0.3s ease',
  },
  deleteButton: {
    position: 'absolute',
    right: '8px',
    top: '8px',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    cursor: 'pointer',
    zIndex: 2,
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
