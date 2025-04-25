import { useCallback, memo, MouseEvent } from 'react';
import { usePokemonContext } from '../context/PokemonContext';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: () => void;
}

// Using memo to prevent unnecessary re-renders
const PokemonCard = memo(({ pokemon, onSelect }: PokemonCardProps) => {
  const { toggleFavorite, isFavorite } = usePokemonContext();
  const favorite = isFavorite(pokemon.id);
  
  // useCallback example: Memoize the event handler to prevent re-creation on each render
  const handleFavoriteToggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering the card click
    toggleFavorite(pokemon.id);
  }, [pokemon.id, pokemon.name, toggleFavorite]);
  
  // useCallback example: Format Pokemon data with memoization
  const formatPokemonData = useCallback(() => {
    return {
      formattedName: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      formattedId: `#${String(pokemon.id).padStart(3, '0')}`,
      typesString: pokemon.types.map(type => 
        type.charAt(0).toUpperCase() + type.slice(1)
      ).join(', '),
    };
  }, [pokemon.id, pokemon.name, pokemon.types]);
  
  const { formattedName, formattedId } = formatPokemonData();
  
  return (
    <div 
      className={`pokemon-card ${favorite ? 'favorite' : ''}`} 
      onClick={onSelect}
    >
      <div className="pokemon-image">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <div className="pokemon-info">
        <div className="pokemon-header">
          <h3>{formattedName}</h3>
          <span className="pokemon-id">{formattedId}</span>
        </div>
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span key={type} className={`type ${type}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
        <div className="pokemon-stats">
          <div>Height: {pokemon.height / 10}m</div>
          <div>Weight: {pokemon.weight / 10}kg</div>
        </div>
        <button 
          className={`favorite-button ${favorite ? 'active' : ''}`}
          onClick={handleFavoriteToggle}
        >
          {favorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
        </button>
      </div>
    </div>
  );
});

export default PokemonCard; 