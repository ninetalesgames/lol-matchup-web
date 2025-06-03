import { Routes, Route } from 'react-router-dom';
import ChampionSelection from './pages/ChampionSelection';
import OpponentSelection from './pages/OpponentSelection';
import MatchupDetails from './pages/MatchupDetails';
import NotesForm from './pages/NotesForm';
import MatchupHistory from './pages/MatchupHistory';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChampionSelection />} />
      <Route path="/opponent/:playerChampion" element={<OpponentSelection />} />
      <Route path="/matchup/:playerChampion/:opponentChampion" element={<MatchupDetails />} />
      <Route path="/notes/:playerChampion/:opponentChampion/:isEditing" element={<NotesForm />} />
      <Route path="/history" element={<MatchupHistory />} />
    </Routes>
  );
}
