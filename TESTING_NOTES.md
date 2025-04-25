# React Hooks Testing Notes

This document provides guidance on how to test the React hooks used in this Pokedex application. It's intended as a live guided test to assess a candidate's understanding of React hooks.

## Hooks Used in This Application

1. **useState** - For local component state
2. **useEffect** - For side effects like API calls and cleanup
3. **useContext** - For global state management
4. **useMemo** - For expensive calculations
5. **useCallback** - For memoized functions

## Testing Areas

### 1. Context API and useContext

The application uses a `PokemonContext` to manage global state. Key testing points:

- Verify the Provider correctly passes values to consuming components
- Test context updates and how they propagate to child components
- Check that context consumers receive the most recent state
- Test toggling favorite status and its effect on the UI

### 2. useEffect Hook

The app has several useEffect implementations:

- Data fetching in PokemonContext and PokemonDetails
- Search debouncing in PokemonList
- Cleanup functions when unmounting

Testing points:
- Verify API calls are made with the correct parameters
- Check that state updates correctly after fetches
- Test that cleanup functions are called on unmount
- Verify dependency arrays work correctly (e.g., refetching when needed)

### 3. useMemo Hook

The app uses useMemo for:

- Filtering Pokemon list based on search and type
- Calculating Pokemon statistics
- Getting unique Pokemon types for the filter dropdown

Testing points:
- Verify memoized values update when dependencies change
- Check that expensive calculations aren't repeated unnecessarily
- Test that filtering works correctly with different inputs

### 4. useCallback Hook

The app uses useCallback for:

- Event handlers like toggling favorites
- Formatting functions in PokemonCard

Testing points:
- Verify callback functions maintain reference equality
- Check that callbacks update only when dependencies change
- Test callback functions with different arguments

## Testing Exercises

Here are some specific exercises you can ask candidates to implement:

1. **Context Testing**: 
   - Write a test to verify that favoriting a Pokemon updates the favorites list
   - Test that the isFavorite function correctly identifies favorited Pokemon

2. **useEffect Testing**:
   - Mock the fetch API and verify data is loaded correctly
   - Test cleanup functions are called when components unmount
   - Verify that API calls are only made when dependencies change

3. **useMemo Testing**:
   - Test the filtering logic with different search terms and type filters
   - Verify the Pokemon stats calculation with different datasets
   - Check that memoized values are cached properly

4. **useCallback Testing**:
   - Verify reference equality of callbacks across renders
   - Test event handlers like the favorite toggle function
   - Verify callbacks update properly when their dependencies change

## Testing Tools and Setup

For testing React hooks, the following tools are recommended:

- **React Testing Library**: For component testing with user-centric approach
- **Jest**: As the test runner and assertion library
- **Mock Service Worker**: For mocking API requests
- **@testing-library/react-hooks**: For testing custom hooks in isolation

## Example Test Cases

Here are a few example test cases to demonstrate testing approaches:

```jsx
// Testing useContext hook
test('useContext - toggling favorite updates the favorites list', () => {
  const { result } = renderHook(() => usePokemonContext(), {
    wrapper: ({ children }) => (
      <PokemonProvider>{children}</PokemonProvider>
    ),
  });
  
  act(() => {
    result.current.toggleFavorite(1);
  });
  
  expect(result.current.favorites).toContain(1);
  
  act(() => {
    result.current.toggleFavorite(1);
  });
  
  expect(result.current.favorites).not.toContain(1);
});

// Testing useEffect for data loading
test('useEffect - Pokemon data is fetched on mount', async () => {
  // Setup mock API response
  server.use(
    rest.get('https://pokeapi.co/api/v2/pokemon', (req, res, ctx) => {
      return res(
        ctx.json({
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
          ]
        })
      );
    })
  );
  
  render(
    <PokemonProvider>
      <PokemonList />
    </PokemonProvider>
  );
  
  // Wait for data to load
  await screen.findByText('Bulbasaur');
  expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
});

// Testing useMemo for filtering
test('useMemo - filtered Pokemon list updates when search changes', () => {
  render(
    <PokemonProvider>
      <PokemonList />
    </PokemonProvider>
  );
  
  // Mock Pokemon data available in context
  
  // Enter search term
  fireEvent.change(screen.getByPlaceholderText('Search Pokemon...'), {
    target: { value: 'char' },
  });
  
  // Verify filtered results
  expect(screen.getByText('Charmander')).toBeInTheDocument();
  expect(screen.getByText('Charmeleon')).toBeInTheDocument();
  expect(screen.getByText('Charizard')).toBeInTheDocument();
  expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
});

// Testing useCallback reference equality
test('useCallback - favorite toggle maintains reference equality', () => {
  const { result, rerender } = renderHook(
    () => {
      const [count, setCount] = useState(0);
      return {
        count,
        setCount,
        handleFavoriteToggle: useCallback(() => {
        }, []) // No dependencies
      };
    }
  );
  
  const initialCallback = result.current.handleFavoriteToggle;
  
  // Trigger a re-render
  act(() => {
    result.current.setCount(1);
  });
  
  // Reference should be the same
  expect(result.current.handleFavoriteToggle).toBe(initialCallback);
});
```

## Evaluation Criteria

Assess the candidate's ability to:

1. Understand the purpose and behavior of each hook
2. Write effective tests that verify correct behavior
3. Use appropriate mocking strategies for external dependencies
4. Test both happy paths and edge cases
5. Identify potential performance issues related to hooks
6. Apply best practices in testing React applications

## Additional Challenges

For more experienced candidates, consider these additional exercises:

1. Test custom hook compositions
2. Test performance optimizations
3. Write tests for concurrent mode considerations
4. Implement error boundary testing
5. Test advanced context scenarios with multiple providers 