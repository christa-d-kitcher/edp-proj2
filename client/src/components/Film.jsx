import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/style.css';

function Film() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SWAPI_FILMS}/${id}`).then(res => res.json()).then(setFilm);
    fetch(`${import.meta.env.VITE_SWAPI_FILMS}/${id}/characters`).then(res => res.json()).then(setCharacters);
    fetch(`${import.meta.env.VITE_SWAPI_FILMS}/${id}/planets`).then(res => res.json()).then(setPlanets);
  }, [id]);

  if (!film) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{film.title}</h2>
      <p>{film.opening_crawl}</p>

      <div className="section">
        <h4>Characters</h4>
        <ul>
          {characters.map(c => (
            <li key={c.character_id}><Link to={`/character/${c.character_id}`}>{c.character_id}</Link></li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4>Planets</h4>
        <ul>
          {planets.map(p => (
            <li key={p.planet_id}><Link to={`/planet/${p.planet_id}`}>{p.planet_id}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Film;