import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/style.css';

function Planet() {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [films, setFilms] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SWAPI_PLANETS}/${id}`).then(res => res.json()).then(setPlanet);
    fetch(`${import.meta.env.VITE_SWAPI_PLANETS}/${id}/films`).then(res => res.json()).then(setFilms);
    fetch(`${import.meta.env.VITE_SWAPI_PLANETS}/${id}/characters`).then(res => res.json()).then(setCharacters);
  }, [id]);

  if (!planet) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{planet.name}</h2>
      <p><strong>Climate:</strong> {planet.climate}</p>

      <div className="section">
        <h4>Films</h4>
        <ul>
          {films.map(f => (
            <li key={f.film_id}><Link to={`/film/${f.film_id}`}>{f.film_id}</Link></li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4>Characters</h4>
        <ul>
          {characters.map(c => (
            <li key={c.id}><Link to={`/character/${c.id}`}>{c.name}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Planet;