import { useState, useEffect, useCallback } from 'react';
import { usePokemonContext } from '../context/PokemonContext';
import { PokemonWithDetails } from '../types';

interface PokemonDetailsProps {
  selectedId: number;
  onClose: () => void;
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({ selectedId, onClose }) => {
  const { pokemons, toggleFavorite, isFavorite } = usePokemonContext();
  const [pokemon, setPokemon] = useState<PokemonWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // useEffect to fetch more detailed Pokemon data when selectedId changes
  useEffect(() => {
    if (!selectedId) return;
    
    const fetchPokemonDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First check if we have this Pokemon in our context
        const basicPokemon = pokemons.find(p => p.id === selectedId);
        
        if (!basicPokemon) {
          throw new Error('Pokemon not found');
        }
        
        // Fetch additional details from API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon details');
        }
        
        const data = await response.json();
        
        // Combine data from our context with additional API data
        setPokemon({
          ...basicPokemon,
          stats: data.stats.map((stat: { stat: { name: string }, base_stat: number }) => ({
            name: stat.stat.name,
            value: stat.base_stat
          })),
          moves: data.moves.slice(0, 5).map((move: { move: { name: string } }) => move.move.name),
          species: data.species.name
        });
      } catch (err) {
        setError('Failed to load Pokemon details. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPokemonDetails();
    
    // Cleanup function
    return () => {
      console.log('PokemonDetails component cleanup');
    };
  }, [selectedId, pokemons]);
  
  // useCallback example: Toggle favorite status
  const handleFavoriteToggle = useCallback(() => {
    if (pokemon) {
      toggleFavorite(pokemon.id);
    }
  }, [pokemon, toggleFavorite]);
  
  if (isLoading) {
    return <div className="pokemon-details loading">Loading Pokemon details...</div>;
  }
  
  if (error) {
    return <div className="pokemon-details error">{error}</div>;
  }
  
  if (!pokemon) {
    return <div className="pokemon-details empty">Select a Pokemon to view details</div>;
  }
  
  return (
    <div className="pokemon-details">
      <button className="close-button" onClick={onClose} aria-label="Close details">×</button>
      
      <div className="pokemon-details-header">
        <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
      </div>
      
      <div className="pokemon-details-content">
        <div className="pokemon-image-large">
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
        
        <div className="pokemon-info-sections">
          <section className="pokemon-types-section">
            <h3>Types</h3>
            <div className="types-list">
              {pokemon.types.map(type => (
                <span key={type} className={`type ${type}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>
          </section>
          
          <section className="pokemon-stats-section">
            <h3>Stats</h3>
            <div className="stats-list">
              {pokemon.stats.map(stat => (
                <div key={stat.name} className="stat-item">
                  <span className="stat-name">
                    {stat.name.replace('-', ' ').toUpperCase()}:
                  </span>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar" 
                      style={{ width: `${Math.min(100, (stat.value / 150) * 100)}%` }}
                    />
                    <span className="stat-value">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="pokemon-abilities-section">
            <h3>Abilities</h3>
            <ul className="abilities-list">
              {pokemon.abilities.map(ability => (
                <li key={ability}>
                  {ability.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </li>
              ))}
            </ul>
          </section>
          
          <section className="pokemon-moves-section">
            <h3>Moves</h3>
            <ul className="moves-list">
              {pokemon.moves.map(move => (
                <li key={move}>
                  {move.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      
      <button 
        className={`favorite-button large ${isFavorite(pokemon.id) ? 'active' : ''}`}
        onClick={handleFavoriteToggle}
      >
        {isFavorite(pokemon.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
      </button>
    </div>
  );
};

export default PokemonDetails; 