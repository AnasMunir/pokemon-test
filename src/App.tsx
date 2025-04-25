import { useState } from 'react';
import { PokemonProvider } from './context/PokemonContext';
import PokemonList from './components/PokemonList';
import PokemonDetails from './components/PokemonDetails';
import Favorites from './components/Favorites';
import './App.css';

const App: React.FC = () => {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'favorites'>('list');

  const handleSelectPokemon = (id: number): void => {
    setSelectedPokemonId(id);
  };

  const handleCloseDetails = (): void => {
    setSelectedPokemonId(null);
  };

  return (
    <PokemonProvider>
      <div className="app">
        <header className="app-header">
          <h1>Pokedex App</h1>
          <p className="subtitle">A React Hooks demonstration with Pokemon</p>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              All Pokemon
            </button>
            <button 
              className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
          </div>
        </header>
        
        <main className="app-content">
          <div className={`tab-content ${selectedPokemonId ? 'with-details' : ''}`}>
            <div className={`tab-panel ${activeTab === 'list' ? 'active' : ''}`}>
              <PokemonList onSelectPokemon={handleSelectPokemon} />
            </div>
            
            <div className={`tab-panel ${activeTab === 'favorites' ? 'active' : ''}`}>
              <Favorites onSelectPokemon={handleSelectPokemon} />
            </div>
            
            {selectedPokemonId && (
              <div className="details-panel">
                <PokemonDetails 
                  selectedId={selectedPokemonId} 
                  onClose={handleCloseDetails} 
                />
              </div>
            )}
          </div>
        </main>
        
        <footer className="app-footer">
          <p>Created to demonstrate React Hooks: useState, useEffect, useContext, useMemo, and useCallback</p>
        </footer>
      </div>
    </PokemonProvider>
  );
};

export default App; 