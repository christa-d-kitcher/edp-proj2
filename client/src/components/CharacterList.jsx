import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';

function CharacterList() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_SWAPI_CHARACTERS)
      .then(res => res.json())
      .then(data => setCharacters(data));
  }, []);

  return (
    <div className="container">
      <h2>Star Wars Characters</h2>
      <ul>
        {characters.map(character => (
          <li key={character._id}>
            <Link to={`/character/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterList;