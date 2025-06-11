// MatchupDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import Layout from '../Layout';
import championsData from '../assets/champions.json';

export default function MatchupDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playerChampion, opponentChampion } = useParams();
  const [notes, setNotes] = useState<Record<string, any>>({});
  const [showEditWins, setShowEditWins] = useState(false);
  const [winCount, setWinCount] = useState(0);
  const [lossCount, setLossCount] = useState(0);

  const key = `${playerChampion}_${opponentChampion}`;
  const opponentData = championsData.find((c) => c.name === opponentChampion);

  const leftSplash = playerChampion
    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${playerChampion}_0.jpg`
    : '';
  const rightSplash = opponentChampion
    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${opponentChampion}_0.jpg`
    : '';

  useEffect(() => {
    const fetchNotes = async () => {
      const savedNotes = await loadNotes(user);
      setNotes(savedNotes);

      const note = savedNotes[key];
      if (note) {
        setWinCount(note.wins || 0);
        setLossCount(note.losses || 0);
      }
    };
    fetchNotes();
  }, [user]);

  const formatTimestamp = (ts: number) =>
    new Date(ts).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const generateSentences = (list: string[], type: 'worked' | 'struggles') => {
    return list.map((entry, i) => (
      <p key={i} style={{ color: type === 'worked' ? '#2ecc71' : '#e74c3c' }}>
        {type === 'worked' ? `🟢 ${entry}` : `🔴 ${entry}`}
      </p>
    ));
  };

  const note = notes[key];
  const wins = note?.wins || 0;
  const losses = note?.losses || 0;
  const total = wins + losses;
  const winrate = total > 0 ? Math.round((wins / total) * 100) : null;
  const hasLoggedNotes =
    note && (note.worked?.length > 0 || note.struggles?.length > 0 || note.items?.length > 0 || note.extra);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          display: 'flex',
        }}
      >
        {leftSplash && (
          <img
            src={leftSplash}
            alt="left"
            style={{ width: '50vw', height: '100%', objectFit: 'cover', opacity: 0.8, transform: 'scaleX(-1)' }}
          />
        )}
        {rightSplash && (
          <img
            src={rightSplash}
            alt="right"
            style={{ width: '50vw', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        )}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '20px',
            background:
              'linear-gradient(to right, rgba(19, 19, 19, 0) 0%, rgba(10,10,10,1) 40%, rgba(10,10,10,1) 60%, rgba(10,10,10,0) 100%)',
          }}
        >
          <Layout showBackground={false}>
            <div style={{ textAlign: 'center' }}>
              <h1>
                {playerChampion} vs {opponentChampion}
              </h1>

              {hasLoggedNotes && (
                <>
                  {note.worked && generateSentences(note.worked, 'worked')}
                  {note.struggles && generateSentences(note.struggles, 'struggles')}

                  {note.items?.length > 0 && (
                    <>
                      <h3>🛠 Items That Helped</h3>
                      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        {note.items.map((id: string) => (
                          <img
                            key={id}
                            src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${id}.png`}
                            alt={id}
                            style={{ width: '40px', height: '40px', borderRadius: 6 }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {note.extra && (
                    <>
                      <h3>📝 Personal Notes</h3>
                      <p>{note.extra}</p>
                    </>
                  )}
                </>
              )}

              <h3>📊 Results</h3>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
  <div style={styles.winratePillContainer}>
    <div style={styles.winratePill}>
      <div style={{ ...styles.greenFill, width: `${(wins / total) * 100}%` }} />
      <div style={{ ...styles.redFill, width: `${(losses / total) * 100}%` }} />
    </div>
    <div style={styles.winrateText}>
      {winrate !== null ? `${winrate}%` : 'N/A'}
    </div>
  </div>
  <span>{total} Games | {wins}W / {losses}L</span>
  <button onClick={() => setShowEditWins(!showEditWins)} style={styles.iconButton}>
    ✏️
  </button>
</div>
{note?.lastUpdated && (
  <p style={{ fontSize: '12px', color: '#aaa' }}>Last played: {formatTimestamp(note.lastUpdated)}</p>
)}



              {showEditWins && (
                <div style={styles.resultEditor}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Wins:</strong>
                    <button onClick={() => setWinCount((prev) => Math.max(0, prev - 1))} style={styles.adjustButton}>
                      -
                    </button>
                    <span style={{ margin: '0 10px' }}>{winCount}</span>
                    <button onClick={() => setWinCount((prev) => prev + 1)} style={styles.adjustButton}>
                      +
                    </button>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Losses:</strong>
                    <button onClick={() => setLossCount((prev) => Math.max(0, prev - 1))} style={styles.adjustButton}>
                      -
                    </button>
                    <span style={{ margin: '0 10px' }}>{lossCount}</span>
                    <button onClick={() => setLossCount((prev) => prev + 1)} style={styles.adjustButton}>
                      +
                    </button>
                  </div>
                  <button
                    style={{ ...styles.button, marginTop: '8px' }}
                    onClick={async () => {
                      const updated = {
                        ...notes,
                        [key]: {
                          ...note,
                          wins: winCount,
                          losses: lossCount,
                          lastUpdated: Date.now(),
                        },
                      };
                      await saveNotes(user, updated);
                      setNotes(updated);
                      setShowEditWins(false);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}

              <h2>Exclusive Matchup Insights:</h2>
              {opponentData?.matchupTips ? (
                opponentData.matchupTips.map((section: any, index: number) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <h3>{section.phase}</h3>
                    <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
                      {section.tips.map((tip: string, idx: number) => (
                        <li key={idx} style={{ marginBottom: '6px' }}>
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>{opponentData?.genericTips || '[No tips available]'}</p>
              )}

              {opponentData?.recommendedPicks?.length ? (
                <>
                  <h3>Recommended Picks</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {opponentData.recommendedPicks.map((champName: string) => (
                      <div key={champName} style={{ textAlign: 'center' }}>
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champName}.png`}
                          alt={champName}
                          style={{ width: 40, height: 40, borderRadius: 8 }}
                        />
                        <p style={{ fontSize: 12 }}>{champName}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => navigate(`/notes/${playerChampion}/${opponentChampion}/false`)}
                  style={styles.button}
                >
                  Log Game
                </button>
                {hasLoggedNotes && (
                  <button
                    onClick={() => navigate(`/notes/${playerChampion}/${opponentChampion}/true`)}
                    style={styles.button}
                  >
                    Edit Notes
                  </button>
                )}
              </div>

              <button onClick={() => navigate(`/opponent/${playerChampion}`)} style={styles.backButton}>
                Back to Opponent Select
              </button>
            </div>
          </Layout>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#34495e',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  adjustButton: {
    marginLeft: '10px',
    marginRight: '10px',
    padding: '2px 8px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#8e44ad',
    color: '#fff',
    cursor: 'pointer',
  },
  resultEditor: {
    marginTop: '10px',
    backgroundColor: '#1e1e1e',
    padding: '10px',
    borderRadius: '10px',
    display: 'inline-block',
  },
winratePillContainer: {
  position: 'relative',
  width: '160px',
  height: '20px',
},

winratePill: {
  display: 'flex',
  width: '100%',
  height: '100%',
  borderRadius: '999px',
  overflow: 'hidden',
  border: '1px solid #444',
  backgroundColor: '#333',
},

greenFill: {
  backgroundColor: '#2ecc71',
  height: '100%',
  transition: 'width 0.3s ease',
},

redFill: {
  backgroundColor: '#e74c3c',
  height: '100%',
  transition: 'width 0.3s ease',
},

winrateText: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '13px',
  color: '#fff',
  pointerEvents: 'none',
},

iconButton: {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#fff',
  marginLeft: '4px',
},


};
