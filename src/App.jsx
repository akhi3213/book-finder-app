import React, { useState, useEffect } from 'react';
// We will inject the CSS dynamically instead of importing a file.

// --- Style ---
// This component will inject all of our CSS into the page's <head>
// This bypasses the need for a separate .css file
function StyleInjector() {
  useEffect(() => {
    const styleId = 'app-styles';
    // Check if the style tag already exists
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      /* Global Styles (from index.css) */
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f3f4f6;
      }

      * {
        box-sizing: border-box;
      }

      /* Component Styles (from App.css) */
      .app-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .main-title {
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
        color: #111827;
        margin-bottom: 2rem;
      }

      .search-box {
        background-color: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 2rem;
      }

      .search-options {
        margin-bottom: 1rem;
      }

      .search-options p {
        font-weight: 600;
        margin: 0 0 0.5rem 0;
      }

      .search-options label {
        margin-right: 1rem;
        cursor: pointer;
      }

      .search-inputs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .search-input {
        flex-grow: 1;
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
      }

      .search-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
      }

      .search-button {
        background-color: #2563eb;
        color: white;
        font-weight: bold;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .search-button:hover {
        background-color: #1d4ed8;
      }

      @media (min-width: 768px) {
        .search-inputs {
          flex-direction: row;
        }
      }

      .results-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      @media (min-width: 640px) {
        .results-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .results-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 1280px) {
        .results-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      .book-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .book-cover {
        width: 100%;
        height: 192px;
        object-fit: cover;
        background-color: #e5e7eb;
      }

      .book-info {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .book-title {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .book-info p {
        margin: 0 0 0.25rem 0;
        color: #374151;
        font-size: 0.9rem;
      }

      .book-info p.published-year {
        margin-top: auto;
        color: #6b7280;
        font-size: 0.8rem;
      }

      .loader {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2.5rem;
      }

      .spinner {
        width: 2.5rem;
        height: 2.5rem;
        border: 4px solid #3b82f6;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .error-message {
        background-color: #fee2e2;
        border: 1px solid #f87171;
        color: #b91c1c;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
      }
    `;
    
    document.head.appendChild(style);

    // Cleanup function to remove the style when the component unmounts
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component renders nothing itself
}

// This is a small "component" or "blueprint" for a loading spinner.
function Loader() {
  return (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );
}

// This is the blueprint for a single Book Card
function BookCard({ book }) {
  // Construct the image URL.
  const coverImageUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : 'https://placehold.co/180x240/e0e0e0/777?text=No+Cover';

  return (
    <div className="book-card">
      <img
        src={coverImageUrl}
        alt={`Cover of ${book.title}`}
        className="book-cover"
        onError={(e) => {
          // This prevents an infinite loop if the placeholder also fails
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/180x240/e0e0e0/777?text=No+Cover';
        }}
      />
      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p>
          <strong>Author:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
        </p>
        <p className="published-year">
          <strong>First Published:</strong> {book.first_publish_year || 'N/A'}
        </p>
      </div>
    </div>
  );
}

// This is the main Application component
function App() {
  // === STATE ===
  // This is the app's memory
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title'); // 'title' or 'author'
  const [books, setBooks] = useState([]); // Holds the list of book results
  const [isLoading, setIsLoading] = useState(false); // True when loading
  const [error, setError] = useState(null); // Holds any error messages

  // === FUNCTIONS ===
  // This function runs when the search button is clicked
  const handleSearch = async () => {
    setIsLoading(true); // Show the spinner
    setError(null);     // Clear old errors
    setBooks([]);       // Clear old results

    const baseUrl = 'https://openlibrary.org/search.json';
    // Dynamically build the URL based on the search type
    const queryParam = searchType === 'title' 
      ? `title=${encodeURIComponent(searchTerm)}` 
      : `author=${encodeURIComponent(searchTerm)}`;
      
    // We'll ask for 21 results
    const url = `${baseUrl}?${queryParam}&limit=21`;

    try {
      // Call the Open Library API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();

      if (data.docs.length === 0) {
        // Handle no results
        setError('No books found for your query. Please try again.');
      } else {
        // Filter out books that don't have a title (some API data is incomplete)
        const validBooks = data.docs.filter(book => book.title);
        setBooks(validBooks);
      }
    } catch (err) {
      // Handle network errors
      setError('Failed to fetch books. Please check your connection and try again.');
      console.error(err); // For debugging
    } finally {
      // This runs no matter what (success or error)
      setIsLoading(false); // Hide the spinner
    }
  };

  // === UI (What you see) ===
  // This is what React renders to the screen
  return (
    <div className="app-container">
      {/* This component injects our styles */}
      <StyleInjector />
      
      {/* --- Header --- */}
      <h1 className="main-title">
        Alex's Book Finder
      </h1>

      {/* --- Search Box --- */}
      <div className="search-box">
        <div className="search-options">
          <p>Search by:</p>
          <div>
            <label>
              <input
                type="radio"
                name="searchType"
                value="title"
                checked={searchType === 'title'}
                onChange={() => setSearchType('title')}
              />
              <span style={{ marginLeft: '4px' }}>Title</span>
            </label>
            <label>
              <input
                type="radio"
                name="searchType"
                value="author"
                checked={searchType === 'author'}
                onChange={() => setSearchType('author')}
              />
              <span style={{ marginLeft: '4px' }}>Author</span>
            </label>
          </div>
        </div>

        <div className="search-inputs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchType === 'title' ? 'e.g., "Dune"' : 'e.g., "Frank Herbert"'}
            className="search-input"
            // This lets the user press Enter to search
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="search-button"
          >
            Search
          </button>
        </div>
      </div>

      {/* --- Results Section --- */}
      <div className="results-container">
        {/* Conditional Rendering: Show the Loader component ONLY when isLoading is true */}
        {isLoading && <Loader />}

        {/* Conditional Rendering: Show the error message ONLY if an error exists */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Conditional Rendering: Show the book results ONLY if the array is not empty */}
        {books.length > 0 && (
          <div className="results-grid">
            {/* Loop over the 'books' array and create a BookCard for each one */}
            {books.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

export default App;

