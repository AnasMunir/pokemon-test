export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
}
// ?? type optimizations
export interface PokemonWithDetails {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStat[];
  moves: string[];
  species: string;
}

// ?? type optimizations
export interface PokemonStatsAndAbilities {
  abilities: string[];
  stats: PokemonStat[];
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonContextType {
  pokemons: Pokemon[];
  isLoading: boolean;
  error: string | null;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}
