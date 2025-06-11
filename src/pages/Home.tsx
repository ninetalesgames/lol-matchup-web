// Home.tsx with level system and winrate pill beside profile icon
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes } from '../services/DataService';
import Layout from '../Layout';
import startMatchupButton from '../assets/startmatchup.png';
import viewMatchupHistoryButton from '../assets/viewmatchuphistory.png';

function timeAgo(timestamp: number): string {
  const now = new Date();
  const updated = new Date(timestamp);
  const diffMs = now.getTime() - updated.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Record<string, any>>({});
  const [mostPlayed, setMostPlayed] = useState('Jax');
  const [recent, setRecent] = useState<[string, any][]>([]);

  useEffect(() => {
    const load = async () => {
      const saved = await loadNotes(user);
      setNotes(saved);

      const champCounts: Record<string, number> = {};
      Object.keys(saved).forEach((key) => {
        const [player] = key.split('_');
        champCounts[player] = (champCounts[player] || 0) + 1;
      });
      const sorted = Object.entries(champCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) setMostPlayed(sorted[0][0]);

      const recentSorted = Object.entries(saved)
        .filter(([_, note]) => note.lastUpdated)
        .sort((a, b) => b[1].lastUpdated - a[1].lastUpdated)
        .slice(0, 3);
      setRecent(recentSorted);
    };
    load();
  }, [user]);

  const opponentSplash = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Chogath_0.jpg`;
  const username = user?.email?.split('@')[0] || 'Guest';
  const totalGames = Object.values(notes).reduce((sum, note: any) => sum + (note.wins || 0) + (note.losses || 0), 0);
  const winStats = Object.values(notes).reduce(
    (acc: { wins: number; total: number }, note: any) => {
      const wins = note.wins || 0;
      const losses = note.losses || 0;
      return { wins: acc.wins + wins, total: acc.total + wins + losses };
    },
    { wins: 0, total: 0 }
  );
  const winrate = winStats.total > 0 ? Math.round((winStats.wins / winStats.total) * 100) : null;
  const level = totalGames <= 10 ? totalGames : 10 + Math.floor((totalGames - 10) / 3);

  return (
    <>
      <div style={styles.backgroundLayer}>
        <img src={`${import.meta.env.BASE_URL}background.png`} alt="Base Background" style={styles.baseBackground} />
        <img src={opponentSplash} alt="Cho'Gath Splash" style={styles.rightSplash} />
      </div>

      <Layout showBackground={false}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${mostPlayed}.png`}
                alt={mostPlayed}
                style={{ width: '80px', height: '80px', borderRadius: '12px', border: '2px solid gold' }}
              />
              <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold' }}>{username}</div>
            </div>

            <div>
              <div style={{ fontSize: '16px' }}>Level {level}</div>
              <div style={styles.winratePillContainer}>
                <div style={styles.winratePill}>
                  <div style={{ ...styles.greenFill, width: `${(winStats.wins / (winStats.total || 1)) * 100}%` }} />
                  <div style={{ ...styles.redFill, width: `${(winStats.losses / (winStats.total || 1)) * 100}%` }} />
                </div>
                <div style={styles.winrateText}>
                  {winrate !== null ? `${winrate}%` : 'N/A'}
                </div>
              </div>
              <div>{winStats.total} Games | {winStats.wins}W / {winStats.losses}L</div>
            </div>
          </div>
                  <h2 style={{ fontSize: '24px', color: '#ffdd57', textShadow: '0 0 10px rgba(255,221,87,0.8)', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>
            READY TO CLIMB?
          </h2>
          <p style={{ marginBottom: '18px', fontSize: '16px', color: '#f0f0f0', fontWeight: '500' }}>
            Start by choosing your champion and who you’re laning against and we’ll guide you through notes and counter tips step by step.
          </p>

          <img
            src={startMatchupButton}
            alt="Start Matchup"
            style={{ width: '160px', height: '160px', cursor: 'pointer', display: 'block', margin: '16px auto', objectFit: 'contain', transition: 'transform 0.1s ease-in-out', filter: 'drop-shadow(0 0 8px rgba(255, 221, 87, 0.4))' }}
            onClick={() => navigate('/champion')}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '16px', marginBottom: '20px', color: '#ffdd57', fontWeight: '600' }}>
            <span style={{ color: '#fff', textShadow: '0 0 6px rgba(255,255,255,0.6)' }}>➀ Pick Your Champ</span>
            <span>→</span>
            <span style={{ color: '#fff', textShadow: '0 0 6px rgba(255,255,255,0.6)' }}>➁ Choose Opponent</span>
            <span>→</span>
            <span style={{ color: '#fff', textShadow: '0 0 6px rgba(255,255,255,0.6)' }}>➂ See Matchup Tips</span>
          </div>

          <img
            src={viewMatchupHistoryButton}
            alt="View Matchup History"
            style={{ width: '160px', height: '160px', cursor: 'pointer', display: 'block', margin: '12px auto', objectFit: 'contain', transition: 'transform 0.1s ease-in-out', filter: 'drop-shadow(0 0 8px rgba(255, 221, 87, 0.4))' }}
            onClick={() => navigate('/history')}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {recent.length > 0 && (
            <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '400px', marginInline: 'auto', color: '#fff' }}>
              <h3 style={{ marginBottom: '10px' }}>🕓 Recent Matchups</h3>
              {recent.map(([key, note]) => {
                const [player, opponent] = key.split('_');
                const time = timeAgo(note.lastUpdated);
                return (
                  <div
                    key={key}
                    style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer' }}
                    onClick={() => navigate(`/matchup/${player}/${opponent}`)}
                  >
                    <strong>{player}</strong> vs <strong>{opponent}</strong>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{time}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  backgroundLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    overflow: 'hidden',
  },
  baseBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  rightSplash: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40vw',
    height: '100%',
    objectFit: 'cover',
    opacity: 1,
    zIndex: 2,
    maskImage: 'linear-gradient(to left, black 20%, transparent)',
    WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent)',
  },
  winratePillContainer: {
    position: 'relative',
    width: '160px',
    height: '20px',
    margin: '8px auto'
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
};
