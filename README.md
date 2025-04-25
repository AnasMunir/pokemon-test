# React Hooks Testing App (Pokedex)

This is a React application built to demonstrate the use of various React hooks including useState, useEffect, useMemo, useCallback, and useContext. The app features a Pokedex interface that allows users to browse Pokemon, filter and search them, view details, and manage favorites.

## Purpose

This application is designed as a practical test environment for candidates to demonstrate their understanding of React hooks and how to test them effectively.

## Hooks Demonstrated

1. **useState** - For local component state management
2. **useEffect** - For data fetching, side effects, and cleanup
3. **useContext** - For global state management (favorites, Pokemon data)
4. **useMemo** - For optimized filtering and calculations
5. **useCallback** - For memoized event handlers and functions

## Key Features

- Fetch and display Pokemon from the PokeAPI
- Filter Pokemon by type and search by name
- Display detailed information about selected Pokemon
- Add/remove Pokemon to/from favorites
- Sort Pokemon by different criteria

## Project Structure

- `/src/context` - Contains the PokemonContext for global state management
- `/src/components` - React components that make up the UI
  - `PokemonList.jsx` - Displays the list of Pokemon with filtering (uses useMemo)
  - `PokemonCard.jsx` - Individual Pokemon card (uses useCallback)
  - `PokemonDetails.jsx` - Detailed view of a Pokemon (uses useEffect)
  - `Favorites.jsx` - Shows favorited Pokemon (uses useContext)

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open your browser to http://localhost:5173

## Testing Guide

This application is meant to be used as a live guided test to evaluate a candidate's understanding of React hooks. Please refer to the `TESTING_NOTES.md` file for:

- Specific testing exercises for each hook
- Example test cases
- Evaluation criteria
- Additional challenges for advanced candidates

## Technologies Used

- React 19
- Vite
- PokeAPI (https://pokeapi.co/)
- CSS (no external UI libraries)

## Notes for Interviewers

This application intentionally includes several performance optimizations and complex hook usages that make it an ideal playground for testing a candidate's knowledge of React hooks. The `TESTING_NOTES.md` file contains specific questions and exercises you can use during the interview.
