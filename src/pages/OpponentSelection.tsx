import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes } from '../services/DataService';
import Layout from '../Layout';
import championsData from '../assets/champions.json';

type Champion = {
  id: string;
  name: string;
  genericTips: string;
  isFavorite: boolean;
};

export default function OpponentSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playerChampion } = useParams<{ playerChampion: string }>();
  const [opponents, setOpponents] = useState<Champion[]>([]);
  const [search, setSearch] = useState<string>('');
 // const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const notes = await loadNotes(user);
      const favList: string[] = notes.favorites || [];

      const loadedOpponents: Champion[] = championsData.map((champ: any) => ({
        ...champ,
        isFavorite: favList.includes(champ.id),
      }));

      setOpponents(loadedOpponents);
    };

    loadData();
  }, [user]);

  const filteredOpponents = opponents
    .filter((champ) => champ.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Who Are You Laning Against?</h1>
        <h2 style={styles.subtitle}>You selected: {playerChampion}</h2>

        <input
          type="text"
          placeholder="Search opponent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <div style={styles.grid}>
          {filteredOpponents.map((champ) => (
            <div
              key={champ.id}
              style={{
                ...styles.card,
                border: champ.isFavorite ? '2px solid gold' : '1px solid #444',
              }}
              onClick={() =>
                navigate(`/matchup/${playerChampion}/${champ.name}`)
              }
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
    marginBottom: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: '20px',
    fontSize: '16px',
    color: '#ccc',
  },
  search: {
    padding: '10px',
    borderRadius: '20px',
    width: '60%',
    marginBottom: '20px',
    border: '1px solid #ccc',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '10px',
    justifyItems: 'center',
    marginBottom: '20px',
  },
  card: {
    position: 'relative',
    width: '80px',
    height: '80px',
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
    fontSize: '10px',
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
