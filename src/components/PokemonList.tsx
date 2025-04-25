import { useState, useEffect, useMemo, useCallback, useRef, ChangeEvent } from "react";
import { usePokemonContext } from "../context/PokemonContext";
import PokemonCard from "./PokemonCard";
import { Pokemon } from "../types";

interface PokemonListProps {
  onSelectPokemon: (id: number) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ onSelectPokemon }) => {
  const { pokemons: allPokemons, isLoading: isInitialLoading, error: initialError } = usePokemonContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"id" | "name" | "type">("id");
  
  // API search states
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Refs for optimization
  const searchCache = useRef<Record<string, Pokemon[]>>({});
  const searchTimeoutRef = useRef<number | null>(null);

  // Get unique types for filter dropdown
  const pokemonTypes = useMemo(() => {
    console.log("Calculating unique Pokemon types");
    const types = new Set<string>();
    allPokemons.forEach((pokemon) => {
      pokemon.types.forEach((type) => {
        types.add(type);
      });
    });
    return ["", ...Array.from(types)].sort();
  }, [allPokemons]);

  // Debounced search function
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    // Check if we have cached results
    const cacheKey = `${term.toLowerCase()}`;
    if (searchCache.current[cacheKey]) {
      console.log("Using cached results for", term);
      setSearchResults(searchCache.current[cacheKey]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log("Searching Pokemon API for:", term);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`);
      if (!response.ok) {
        throw new Error("Pokemon API search failed");
      }

      const data = await response.json();
      const filteredResults = data.results.filter(
        (pokemon: { name: string }) => 
          pokemon.name.toLowerCase().includes(term.toLowerCase())
      );

      // Fetch details for each result
      const resultsWithDetails = await Promise.all(
        filteredResults.slice(0, 20).map(async (pokemon: { name: string; url: string }) => {
          const detailResponse = await fetch(pokemon.url);
          const pokemonData = await detailResponse.json();
          
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

      // Cache the results
      searchCache.current[cacheKey] = resultsWithDetails;
      setSearchResults(resultsWithDetails);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Failed to search Pokemon. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input with debounce
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout for the search
    searchTimeoutRef.current = window.setTimeout(() => {
      performSearch(term);
    }, 500); // 500ms debounce
  }, [performSearch]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Determine which Pokemon to display
  const displayPokemons = useMemo(() => {
    // If actively searching or have search results, use those
    if (searchTerm && (isSearching || searchResults.length > 0)) {
      let filtered = searchResults;
      
      // Apply type filter if selected
      if (typeFilter) {
        filtered = filtered.filter((pokemon) =>
          pokemon.types.includes(typeFilter)
        );
      }
      
      // Sort the filtered list
      return filtered.sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "type") {
          return a.types[0].localeCompare(b.types[0]);
        }
        // Default: sort by id
        return a.id - b.id;
      });
    }
    
    // Otherwise use the default filtering logic on all Pokemon
    let filtered = allPokemons;
    
    // Apply search term filter locally
    if (searchTerm) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.includes(typeFilter)
      );
    }
    
    // Sort the filtered list
    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "type") {
        return a.types[0].localeCompare(b.types[0]);
      }
      // Default: sort by id
      return a.id - b.id;
    });
  }, [
    allPokemons,
    searchTerm,
    typeFilter,
    sortBy,
    searchResults,
    isSearching
  ]);

  // Show loading state
  if (isInitialLoading) {
    return <div className="loading">Loading Pokemon data...</div>;
  }

  // Show error state
  if (initialError) {
    return <div className="error">{initialError}</div>;
  }

  return (
    <div className="pokemon-list">
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {isSearching && <div className="search-spinner">Searching...</div>}
        </div>

        <select
          value={typeFilter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setTypeFilter(e.target.value)
          }
          className="type-filter"
          aria-label="Filter Pokemon by type"
        >
          <option value="">All Types</option>
          {pokemonTypes.slice(1).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <div className="sort-options">
          <span>Sort by:</span>
          <button
            className={sortBy === "id" ? "active" : ""}
            onClick={() => setSortBy("id")}
          >
            ID
          </button>
          <button
            className={sortBy === "name" ? "active" : ""}
            onClick={() => setSortBy("name")}
          >
            Name
          </button>
          <button
            className={sortBy === "type" ? "active" : ""}
            onClick={() => setSortBy("type")}
          >
            Type
          </button>
        </div>
      </div>

      {searchError && <div className="error">{searchError}</div>}

      <div className="pokemon-stats">
        <p>
          Showing {displayPokemons.length} of {allPokemons.length} Pokemon
          {searchTerm && ` (searching for "${searchTerm}")`}
        </p>
      </div>

      <div className="pokemon-grid">
        {displayPokemons.length > 0 ? (
          displayPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onSelect={() => onSelectPokemon(pokemon.id)}
            />
          ))
        ) : (
          <p className="no-results">
            {isSearching 
              ? "Searching..." 
              : "No Pokemon found matching your criteria"}
          </p>
        )}
      </div>
    </div>
  );
};

export default PokemonList;
