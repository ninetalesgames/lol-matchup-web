import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import championsData from '../assets/champions.json';
import Layout from '../Layout';

type Champion = {
  id: string;
  name: string;
  genericTips: string;
  isFavorite: boolean;
};

export default function ChampionSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [search, setSearch] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const loadedChamps: Champion[] = championsData.map((champ: any) => ({
        ...champ,
        isFavorite: false,
      }));

      const notes = await loadNotes(user);
      const favList: string[] = notes.favorites || [];

      const updatedChamps = loadedChamps.map((champ) => ({
        ...champ,
        isFavorite: favList.includes(champ.id),
      }));

      setChampions(updatedChamps);
      setFavorites(favList);
    };

    loadData();
  }, [user]);

  const toggleFavorite = async (id: string) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((fav) => fav !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }

    setFavorites(updatedFavorites);
    await saveNotes(user, { favorites: updatedFavorites });

    const updatedChamps = champions.map((champ) =>
      champ.id === id ? { ...champ, isFavorite: !champ.isFavorite } : champ
    );
    setChampions(updatedChamps);
  };

  const filteredChampions = champions
    .filter((champ) => champ.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Who Are You Playing Today?</h1>

        <input
          type="text"
          placeholder="Search champion..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <div style={styles.grid}>
          {filteredChampions.map((champ) => (
            <div
              key={champ.id}
              style={{
                ...styles.card,
                border: champ.isFavorite ? '2px solid gold' : '1px solid #444',
              }}
              onClick={() => navigate(`/opponent/${champ.name}`)}
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
              {champ.isFavorite && <div style={styles.star}>⭐</div>}
            </div>
          ))}
        </div>

        <button style={styles.button} onClick={() => navigate('/history')}>
          View Matchup History
        </button>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    backgroundColor: '#1a1f2e',
    minHeight: '100vh',
    color: '#fff',
    textAlign: 'center',
    width: '100%',
    maxWidth: '100%', // Force full stretch
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '20px',
    fontSize: '2rem',
  },
  search: {
    padding: '10px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto 20px',
    display: 'block',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '16px',
    justifyItems: 'center',
    padding: '0 10px',
    marginBottom: '20px',
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
  star: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    fontSize: '14px',
    color: 'gold',
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
