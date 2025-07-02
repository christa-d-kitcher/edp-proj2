import { Routes, Route } from 'react-router-dom';
import CharacterList from './components/CharacterList';
import Character from './components/Character';
import Film from './components/Film';
import Planet from './components/Planet';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CharacterList />} />
      <Route path="/character/:id" element={<Character />} />
      <Route path="/film/:id" element={<Film />} />
      <Route path="/planet/:id" element={<Planet />} />
    </Routes>
  );
}

export default App;
