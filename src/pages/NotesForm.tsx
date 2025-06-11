// NotesForm.tsx (Visual Match Upgrade)
import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loadNotes, saveNotes } from '../services/DataService';
import { useSaveStatus } from '../components/SaveStatus';
import Layout from '../Layout';
import championData from '../assets/champions.json';
import allItems from '../assets/items.json';

const outcomeOptions = ['🏆 Win', '❌ Loss'];
const workedOptions = [
  'Won level 2 all-in',
  'Froze near my tower',
  'Won early trades',
  'Roamed mid',
  'Deep ward after shove',
  'Waited for my cooldowns',
  'Set up our jungle gank',
  'Avoided all-in window',
  'Built anti-heal early',
  'Traded after ability missed'
];
const struggleOptions = [
  'Got ganked early',
  'Got poked out',
  'They froze wave',
  'Lost early trades',
  'Missed CS under tower',
  'Died to all-in',
  'They had jungle help',
  'Was forced under tower',
  'They played safe',
  "Couldn't roam",
  'Their cooldowns outpaced yours',
  'They built early armor'
];

export default function NotesForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playerChampion, opponentChampion, isEditing } = useParams();
  const key = `${playerChampion}_${opponentChampion}`;

  const [notes, setNotes] = useState<Record<string, any>>({});
  const [outcome, setOutcome] = useState('');
  const [worked, setWorked] = useState<string[]>([]);
  const [struggles, setStruggles] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [extra, setExtra] = useState('');
  const [showFullItemSearch, setShowFullItemSearch] = useState(false);
  const [itemSearch, setItemSearch] = useState('');

  const { triggerCheck, SaveCheck } = useSaveStatus();
  const opponent = championData.find((c) => c.id === opponentChampion);
  const recommendedItems = opponent?.recommendedItems || [];

  useEffect(() => {
    const fetchNotes = async () => {
      const loaded = await loadNotes(user);
      setNotes(loaded);

      if (isEditing === 'true') {
        const note = loaded[key];
        if (note) {
          setOutcome(note.outcome || '');
          setWorked(note.worked || []);
          setStruggles(note.struggles || []);
          setItems(note.items || []);
          setExtra(note.extra || '');
        }
      }
    };
    fetchNotes();
  }, [isEditing, user, key]);

  const toggleSet = (list: string[], value: string, setter: (val: string[]) => void) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

 const handleSave = async () => {
  const prev = notes[key] || {};
  const outcomeSymbol = outcome.trim();

  // Determine updated win/loss count
  const isNewGame = isEditing !== 'true';
  const newWins = isNewGame && outcomeSymbol === '🏆 Win' ? (prev.wins || 0) + 1 : prev.wins || 0;
  const newLosses = isNewGame && outcomeSymbol === '❌ Loss' ? (prev.losses || 0) + 1 : prev.losses || 0;

  const updated = {
    ...notes,
    [key]: {
      ...prev,
      outcome: outcomeSymbol,
      worked,
      struggles,
      items,
      extra,
      wins: newWins,
      losses: newLosses,
      lastUpdated: Date.now(),
    },
  };

  await saveNotes(user, updated);
  triggerCheck();
  setTimeout(() => navigate(-1), 1000);
};


  const leftSplash = playerChampion
    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${playerChampion}_0.jpg`
    : '';
  const rightSplash = opponentChampion
    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${opponentChampion}_0.jpg`
    : '';

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, display: 'flex' }}>
        {leftSplash && <img src={leftSplash} alt="left" style={{ width: '50vw', height: '100%', objectFit: 'cover', opacity: 0.8, transform: 'scaleX(-1)' }} />}
        {rightSplash && <img src={rightSplash} alt="right" style={{ width: '50vw', height: '100%', objectFit: 'cover', opacity: 0.8 }} />}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', zIndex: 2, padding: '20px', background: 'linear-gradient(to right, rgba(19, 19, 19, 0) 0%, rgba(10,10,10,1) 40%, rgba(10,10,10,1) 60%, rgba(10,10,10,0) 100%)' }}>
          <Layout showBackground={false}>
            <div style={{ textAlign: 'center', maxWidth: '900px', margin: 'auto' }}>
              <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>{isEditing === 'true' ? 'Edit Notes' : 'Log Game'}</h1>

              <section>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Lane Outcome</h3>
                {outcomeOptions.map(opt => (
                  <button key={opt} onClick={() => setOutcome(opt)} style={{ margin: '5px', padding: '10px 18px', borderRadius: '20px', color: '#fff', border: 'none', cursor: 'pointer', backgroundColor: outcome === opt ? '#8e44ad' : '#444' }}>{opt}</button>
                ))}
              </section>

              <section>
                <h3 style={{ fontSize: '20px', marginTop: '20px' }}>What Worked</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {workedOptions.map(opt => (
                    <button key={opt} onClick={() => toggleSet(worked, opt, setWorked)} style={{ margin: '5px', padding: '8px 14px', borderRadius: '20px', color: '#fff', border: 'none', cursor: 'pointer', backgroundColor: worked.includes(opt) ? '#27ae60' : '#444' }}>{opt}</button>
                  ))}
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: '20px', marginTop: '20px' }}>What Gave You Trouble</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {struggleOptions.map(opt => (
                    <button key={opt} onClick={() => toggleSet(struggles, opt, setStruggles)} style={{ margin: '5px', padding: '8px 14px', borderRadius: '20px', color: '#fff', border: 'none', cursor: 'pointer', backgroundColor: struggles.includes(opt) ? '#c0392b' : '#444' }}>{opt}</button>
                  ))}
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: '20px', marginTop: '20px' }}>Items That Helped</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', margin: '10px 0' }}>
                  {recommendedItems.map(({ id, name }) => (
                    <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '64px' }} onClick={() => toggleSet(items, id, setItems)}>
                      <img src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${id}.png`} alt={name} style={{ width: '48px', height: '48px', borderRadius: '6px', marginBottom: '4px', border: items.includes(id) ? '2px solid #2ecc71' : '2px solid transparent' }} />
                      <div style={{ fontSize: '12px', color: '#fff', textAlign: 'center' }}>{name}</div>
                    </div>
                  ))}
                </div>
                <button style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#8e44ad', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }} onClick={() => setShowFullItemSearch(!showFullItemSearch)}>+ More Items</button>

                {showFullItemSearch && (
                  <div>
                    <input type="text" placeholder="Search for items..." value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} style={{ width: '80%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', margin: '10px 0' }}>
                      {allItems.filter(item => item.name.toLowerCase().includes(itemSearch.toLowerCase())).map((item) => (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '64px' }} onClick={() => toggleSet(items, item.id, setItems)}>
                          <img src={item.icon} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '6px', marginBottom: '4px', border: items.includes(item.id) ? '2px solid #2ecc71' : '2px solid transparent' }} />
                          <div style={{ fontSize: '12px', color: '#fff', textAlign: 'center' }}>{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section>
                <h3 style={{ fontSize: '20px', marginTop: '20px' }}>Extra Notes (Optional)</h3>
                <textarea value={extra} onChange={(e) => setExtra(e.target.value)} rows={3} style={{ width: '80%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '10px' }} />
              </section>

              <div>
                <button style={{ margin: '10px', padding: '10px 24px', backgroundColor: '#8e44ad', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }} onClick={handleSave}>Save</button>
                <SaveCheck />
              </div>

              <button style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#34495e', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }} onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </Layout>
        </div>
      </div>
    </>
  );
}
