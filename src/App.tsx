import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
// import ChampionSelection from './pages/ChampionSelection';
// import OpponentSelection from './pages/OpponentSelection';
import MatchupDetails from './pages/MatchupDetails';
import NotesForm from './pages/NotesForm';
import MatchupHistory from './pages/MatchupHistory';
import MatchupSetup from './pages/MatchupSetup';

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<MatchupSetup />} />

        <Route path="/matchup/:playerChampion/:opponentChampion" element={<MatchupDetails />} />
        <Route path="/notes/:playerChampion/:opponentChampion/:isEditing" element={<NotesForm />} />
        <Route path="/history" element={<MatchupHistory />} />
      </Routes>
    </>
  );
}
