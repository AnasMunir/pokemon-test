import { useState, useMemo, useRef, ChangeEvent } from "react";
import { usePokemonContext } from "../context/PokemonContext";
import PokemonCard from "./PokemonCard";
import { Pokemon } from "../types";

interface PokemonListProps {
  onSelectPokemon: (id: number) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ onSelectPokemon }) => {
  const {
    pokemons: allPokemons,
    isLoading: isInitialLoading,
    error: initialError,
  } = usePokemonContext();
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"id" | "name" | "type">("id");

  // ?? Get unique types for filter dropdown
  // const pokemonTypes =

  // ?? search function
  //??  const performSearch =

  // ?Handle search input
  // ??const handleSearchChange

  // ?? Clean up timeout
  // useEffect(() => {

  // });


  // Determine which Pokemon to display
  const displayPokemons = useMemo(() => {
    // If actively searching or have search results, use those

    // Otherwise use the default filtering logic on all Pokemon
    let filtered = allPokemons;

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
  }, [allPokemons, typeFilter, sortBy]);

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
            // value={searchTerm}
            // onChange={handleSearchChange}
            className="search-input"
          />
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
          {/* {pokemonTypes.map((type) => (
            
          ))} */}
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

      <div className="pokemon-stats">
        <p>
          Showing {displayPokemons.length} of {allPokemons.length} Pokemon
          {/* {searchTerm && ` (searching for "${searchTerm}")`} */}
        </p>
      </div>

      <div className="pokemon-grid">
        {displayPokemons.length > 0 &&
          displayPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onSelect={() => onSelectPokemon(pokemon.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default PokemonList;
