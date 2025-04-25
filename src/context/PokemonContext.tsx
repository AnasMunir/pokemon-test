import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pokemon, PokemonContextType } from '../types';

// Create context
export const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

// Custom hook to use the Pokemon context
export const usePokemonContext = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
};

interface PokemonProviderProps {
  children: ReactNode;
}

// Provider component
export const PokemonProvider: React.FC<PokemonProviderProps> = ({ children }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Pokemon data on component mount
  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        
        // Add additional details to each Pokemon
        const pokemonWithDetails: Pokemon[] = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
            return {
              id: pokemonData.id,
              name: pokemon.name,
              image: pokemonData.sprites.front_default,
              types: pokemonData.types.map((type: { type: { name: string } }) => type.type.name),
              height: pokemonData.height,
              weight: pokemonData.weight,
              abilities: pokemonData.abilities.map((ability: { ability: { name: string } }) => ability.ability.name)
            };
          })
        );
        setPokemons(pokemonWithDetails);
      } catch (err) {
        setError('Failed to fetch Pokemon data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (pokemonId: number): void => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(pokemonId)) {
        return prevFavorites.filter(id => id !== pokemonId);
      } else {
        return [...prevFavorites, pokemonId];
      }
    });
  };

  // Check if a Pokemon is favorited
  const isFavorite = (pokemonId: number): boolean => {
    return favorites.includes(pokemonId);
  };

  return (
    <PokemonContext.Provider value={{ 
      pokemons, 
      isLoading, 
      error, 
      favorites,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </PokemonContext.Provider>
  );
}; 