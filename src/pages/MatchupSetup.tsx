// MatchupSetup.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import championsData from '../assets/champions.json';
import Layout from '../Layout';
import { useLevel } from '../LevelContext'; // 👈 Add this

export default function MatchupSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const lockInRef = useRef<HTMLDivElement>(null);

  const [champions, setChampions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLane, setSelectedLane] = useState<string>('All');
  const [player, setPlayer] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
 const { level } = useLevel(); // ✅ ACTUALLY call the hook here

  useEffect(() => {
    const loadData = async () => {
      const favs = (await loadNotes(user)).favorites || [];
      const loaded = championsData.map((champ: any) => ({
        ...champ,
        isFavorite: favs.includes(champ.id),
      }));
      setChampions(loaded);
      setFavorites(favs);
    };
    loadData();
  }, [user]);

  const toggleFavorite = async (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    await saveNotes(user, { favorites: updated });
    setChampions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleChampionClick = (champ: any) => {
    if (!player) {
      setPlayer(champ);
      setTimeout(() => lockInRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (player && champ.id === player.id) {
      setPlayer(null);
      setOpponent(null);
    } else if (!opponent && champ.id !== player.id) {
      setOpponent(champ);
      setTimeout(() => lockInRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (opponent && champ.id === opponent.id) {
      setOpponent(null);
    }
  };

  const handleUnselect = (role: 'player' | 'opponent') => {
    if (role === 'player') {
      setPlayer(null);
      setOpponent(null);
    } else {
      setOpponent(null);
    }
  };

  const filtered = champions
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedLane === 'All' || c.lanes?.includes(selectedLane))
    )
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  return (
    <>
      <div style={styles.skyboxLayer} />
      <Layout>
        <div style={styles.container}>
          <h1 style={styles.title}>Pick Your Champion</h1>
          <input
            type="text"
            placeholder="Search champion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <div style={styles.laneButtons}>
            {['All', 'Top', 'Jungle', 'Mid', 'Bot', 'Support'].map((lane) => (
              <button
                key={lane}
                style={{
                  ...styles.laneButton,
                  backgroundColor: selectedLane === lane ? '#8e44ad' : '#444'
                }}
                onClick={() => setSelectedLane(lane)}
              >
                {lane}
              </button>
            ))}
          </div>
{level <= 10 && (
          <p style={{ color: '#ccc', fontSize: '13px', marginBottom: '12px' }}>
            Right-click a champion to mark as favorite ⭐
          </p>
)}
          <div ref={lockInRef}>
            {(player || opponent) && (
              <div style={{ ...styles.lockInContainer, transition: 'all 0.4s ease' }}>
                <div
                  style={styles.lockInChampBox}
                  onClick={() => handleUnselect('player')}
                  title="Click to unselect"
                >
                  {player && (
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${player.id}.png`}
                      alt={player.name}
                      style={styles.lockInChamp}
                    />
                  )}
                </div>
                <div style={styles.vsText}>VS</div>
                <div
                  style={styles.lockInChampBox}
                  onClick={() => handleUnselect('opponent')}
                  title="Click to unselect"
                >
                  {opponent && (
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${opponent.id}.png`}
                      alt={opponent.name}
                      style={styles.lockInChamp}
                    />
                  )}
                </div>
              </div>
            )}

            {player && opponent && (
              <button
                style={styles.button}
                onClick={() => navigate(`/matchup/${player.name}/${opponent.name}`)}
              >
                Lock In
              </button>
            )}
          </div>

          <div style={styles.grid}>
            {filtered.map((champ) => (
              <div
                key={champ.id}
                style={{
                  ...styles.card,
                  border:
                    champ.id === player?.id
                      ? '2px solid #3498db'
                      : champ.id === opponent?.id
                      ? '2px solid #e74c3c'
                      : champ.isFavorite
                      ? '2px solid gold'
                      : '1px solid #444',
                  transform:
                    champ.id === player?.id || champ.id === opponent?.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
                onClick={() => handleChampionClick(champ)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFavorite(champ.id);
                }}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champ.id}.png`}
                  alt={champ.name}
                  style={styles.image}
                />
                <div style={styles.champName}>{champ.name}</div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  skyboxLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    backgroundImage: `url("${import.meta.env.BASE_URL}background.webp")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    opacity: 0.8,
    filter: 'brightness(1)',
  },
  container: {
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  search: {
    padding: '10px',
    borderRadius: '20px',
    width: '80%',
    maxWidth: '400px',
    marginBottom: '12px',
    border: '1px solid #ccc',
  },
  laneButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px'
  },
  laneButton: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: 'none',
    color: '#fff',
    fontSize: '12px',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '16px',
    justifyItems: 'center',
    marginTop: '20px'
  },
  card: {
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#2c3140',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  champName: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    fontSize: '11px',
    padding: '2px 0',
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  lockInContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    margin: '20px 0 10px',
    cursor: 'pointer'
  },
  lockInChampBox: {
    width: '100px',
    height: '100px',
    border: '2px solid #fff',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  lockInChamp: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  vsText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
  },
};
