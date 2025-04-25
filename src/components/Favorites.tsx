import { useMemo } from 'react';
import { usePokemonContext } from '../context/PokemonContext';

interface FavoritesProps {
  onSelectPokemon: (id: number) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onSelectPokemon }) => {
  const { pokemons, favorites } = usePokemonContext();
  
  // useMemo example: Filter favorites only when dependencies change
  const favoritedPokemons = useMemo(() => {
    return pokemons.filter(pokemon => favorites.includes(pokemon.id));
  }, [pokemons, favorites]);
  
  if (favoritedPokemons.length === 0) {
    return (
      <div className="favorites empty">
        <h2>Favorites</h2>
        <p>You haven't added any favorites yet.</p>
      </div>
    );
  }
  
  return (
    <div className="favorites">
      <h2>Favorites ({favoritedPokemons.length})</h2>
      <div className="favorites-list">
        {favoritedPokemons.map(pokemon => (
          <div 
            key={pokemon.id} 
            className="favorite-item"
            onClick={() => onSelectPokemon(pokemon.id)}
          >
            <img 
              src={pokemon.image} 
              alt={pokemon.name} 
              className="favorite-image"
            />
            <div className="favorite-info">
              <span className="favorite-name">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </span>
              <span className="favorite-id">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites; 