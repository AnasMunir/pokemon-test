export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
}

export interface PokemonWithDetails extends Pokemon {
  stats: PokemonStat[];
  moves: string[];
  species: string;
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