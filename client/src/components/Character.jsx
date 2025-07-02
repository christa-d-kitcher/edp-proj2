import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/style.css';

function Character() {
  //const { id } = useParams();
  const id = parseInt(useParams().id);
 
  const [character, setCharacter] = useState(null);
  const [planet, setPlanet] = useState(null);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SWAPI_CHARACTERS}/${id}`).then(res => res.json()).then(setCharacter);
    //fetch(`${import.meta.env.VITE_SWAPI_CHARACTERS}/${id}/planet`).then(res => res.json()).then(setPlanet);
    fetch(`${import.meta.env.VITE_SWAPI_CHARACTERS}/${id}/films`).then(res => res.json()).then(setFilms);
  }, [id]);

  if (!character) return <div className="container">Loading...</div>;

  //console.log(films);

  return (
    <div className="container">
      <h2>{character.name}</h2>

      <div className="section">
        <h4>Homeworld</h4>
        <p>{<Link to={`/planet/${character?.homeworld}`}>{character?.homeworldInfo?.name}</Link>}</p> 
      </div>

      <div className="section">
        <h4>Films</h4>
        <ul>
          {films.map(f => (
            <li key={f.film_id}><Link to={`/film/${f?.film_id}`}>{f?.film_id}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Character;