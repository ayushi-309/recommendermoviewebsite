import React from 'react'
import { useGlobalContext } from './context'

const Search = () => {
  const { 
    query, 
    setQuery, 
    isError, 
    activeTab, 
    searchHistory, 
    clearHistory, 
    sortBy, 
    setSortBy, 
    filterType, 
    setFilterType 
  } = useGlobalContext()

  // Curated categories for interactive discoverability
  const quickSearches = [
    { label: 'Harry Potter', queryValue: 'harry potter' },
    { label: 'Marvel', queryValue: 'marvel' },
    { label: 'Batman', queryValue: 'batman' },
    { label: 'Star Wars', queryValue: 'star wars' },
    { label: 'Sci-Fi Classics', queryValue: 'interstellar' },
    { label: 'Avengers', queryValue: 'avengers' }
  ]

  if (activeTab === 'watchlist') {
    return (
      <section className='search-section' style={{ marginBottom: '2rem' }}>
        <h2>Your Saved Watchlist</h2>
        <p style={{ fontSize: '1.6rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Your personalized curation of cinematic experiences
        </p>
      </section>
    )
  }

  return (
    <>
      <section className='search-section'>
        <h2>Discover Cinematic Gems</h2>
        
        <form className='search-form' action='#' onSubmit={(e) => e.preventDefault()}>
          <div className='search-input-wrapper'>
            <span className="material-symbols-outlined search-icon">search</span>
            
            <input
              type='text'
              placeholder='Search movies, series, or games...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search movie query"
            />
            
            {query && (
              <span 
                className="material-symbols-outlined clear-icon" 
                onClick={() => setQuery('')}
                role="button"
                aria-label="Clear search input"
              >
                close
              </span>
            )}
          </div>
        </form>

        {/* Quick Search Tags for Discoverability */}
        <div className='quick-tags'>
          {quickSearches.map((tag) => {
            const isActive = query.toLowerCase() === tag.queryValue.toLowerCase()
            return (
              <button
                key={tag.label}
                className={`tag-pill ${isActive ? 'active' : ''}`}
                onClick={() => setQuery(tag.queryValue)}
              >
                {tag.label}
              </button>
            )
          })}
        </div>

        {/* Recent Search History Tracker Bar */}
        {searchHistory && searchHistory.length > 0 && (
          <div className="recent-searches">
            <span className="recent-title">Recent Searches:</span>
            {searchHistory.map((histQuery) => (
              <button
                key={histQuery}
                className="recent-pill"
                onClick={() => setQuery(histQuery)}
              >
                <span className="material-symbols-outlined">history</span>
                {histQuery}
              </button>
            ))}
            <button className="btn-clear-history" onClick={clearHistory} title="Clear Recent Searches">
              <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>delete</span>
              Clear
            </button>
          </div>
        )}

        {/* Premium Sorting & Filtering Controls Bar */}
        <div className="controls-dashboard">
          {/* Filtering Control Panel */}
          <div className="control-group">
            <span className="control-label">
              <span className="material-symbols-outlined">filter_alt</span>
              Filter Type
            </span>
            <div className="control-options">
              {[
                { label: 'All', value: 'all' },
                { label: 'Movies', value: 'movie' },
                { label: 'Series', value: 'series' },
                { label: 'Games', value: 'game' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`control-btn ${filterType === opt.value ? 'active' : ''}`}
                  onClick={() => setFilterType(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Control Panel */}
          <div className="control-group">
            <span className="control-label">
              <span className="material-symbols-outlined">swap_vert</span>
              Sort By
            </span>
            <div className="control-options">
              {[
                { label: 'Default', value: 'default' },
                { label: 'Newest', value: 'year-desc' },
                { label: 'Oldest', value: 'year-asc' },
                { label: 'A-Z', value: 'title-asc' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`control-btn ${sortBy === opt.value ? 'active' : ''}`}
                  onClick={() => setSortBy(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Styled Error Display */}
        {isError.show && (
          <div className='card-error'>
            <div className='error-alert'>
              <span className="material-symbols-outlined">warning</span>
              <p>{isError.msg}</p>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default Search