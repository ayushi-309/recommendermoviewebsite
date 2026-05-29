import React from 'react'
import { useGlobalContext } from './context'
import { NavLink } from 'react-router-dom'

const Movies = () => {
  const { 
    movie, 
    isLoading, 
    watchlist, 
    toggleWatchlist, 
    activeTab, 
    setActiveTab,
    sortBy,
    filterType,
    personalRatings
  } = useGlobalContext()

  // Shimmer skeleton cards to replace plain text loading indicators
  const MovieSkeleton = () => (
    <div className="skeleton-grid container grid grid-4-col">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-poster"></div>
          <div className="skeleton-info">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-meta"></div>
          </div>
        </div>
      ))}
    </div>
  )

  if (isLoading && activeTab === 'explore') {
    return <MovieSkeleton />
  }

  // Choose source list based on tab
  const displayMovies = activeTab === 'watchlist' ? watchlist : movie

  // Empty Watchlist State Layout
  if (activeTab === 'watchlist' && watchlist.length === 0) {
    return (
      <div className="container">
        <div className="empty-watchlist">
          <span className="material-symbols-outlined empty-watchlist-icon">bookmark_border</span>
          <h3>Your Watchlist is Empty</h3>
          <p>Begin exploring cinematic masterpieces and bookmark your favorites to curate your own personal library!</p>
          <button className="btn-primary" onClick={() => setActiveTab('explore')}>
            Discover Movies
          </button>
        </div>
      </div>
    )
  }

  // --- Clientside Filtering & Sorting Controls Logic ---
  let processedMovies = displayMovies ? [...displayMovies] : []

  // 1. Apply Media Type Filtering
  if (filterType !== 'all') {
    processedMovies = processedMovies.filter(
      (item) => item.Type && item.Type.toLowerCase() === filterType.toLowerCase()
    )
  }

  // 2. Apply Custom Sorting
  if (sortBy !== 'default') {
    processedMovies.sort((a, b) => {
      if (sortBy === 'year-desc') {
        const yearA = parseInt(a.Year.substring(0, 4)) || 0
        const yearB = parseInt(b.Year.substring(0, 4)) || 0
        return yearB - yearA
      }
      if (sortBy === 'year-asc') {
        const yearA = parseInt(a.Year.substring(0, 4)) || 0
        const yearB = parseInt(b.Year.substring(0, 4)) || 0
        return yearA - yearB
      }
      if (sortBy === 'title-asc') {
        return a.Title.localeCompare(b.Title)
      }
      return 0
    })
  }

  // Empty Filtered Results Layout
  if (displayMovies && displayMovies.length > 0 && processedMovies.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '5.6rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          filter_list_off
        </span>
        <h3 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', color: '#fff' }}>No Matching Filters</h3>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          No listings found matching the media type "<strong>{filterType}</strong>" in these results.
        </p>
      </div>
    )
  }

  return (
    <>
      <section className='movie-page'>
        <div className='container grid grid-4-col'>
          {processedMovies.map((curMovie) => {
            const { Title, imdbID, Poster, Year, Type } = curMovie
            
            // Check if movie is favorited
            const isBookmarked = watchlist.some(item => item.imdbID === imdbID)
            
            // Fetch personal star rating (if saved)
            const userRating = personalRatings[imdbID]

            return (
              <NavLink to={`/movie/${imdbID}`} key={imdbID} className="movie-card-link">
                <div className='movie-card-wrapper'>
                  {/* Media Type Overlay Pill */}
                  {Type && (
                    <span className="type-badge">
                      {Type}
                    </span>
                  )}

                  {/* Bookmark Button Overlay */}
                  <button 
                    className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleWatchlist(curMovie)
                    }}
                    title={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
                    aria-label={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    <span className="material-symbols-outlined">
                      {isBookmarked ? 'bookmark' : 'bookmark_add'}
                    </span>
                  </button>

                  <div className='poster-container'>
                    {Poster && Poster !== "N/A" ? (
                      <img src={Poster} alt={Title} loading="lazy" />
                    ) : (
                      // Creative custom fallback cover
                      <div 
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #1e1b4b, #311042)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '2rem',
                          textAlign: 'center',
                          color: '#fff'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '4.8rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                          movie_filter
                        </span>
                        <p style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 700 }}>{Title}</p>
                        <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>No Poster Available</span>
                      </div>
                    )}
                    <div className='poster-overlay'></div>
                  </div>

                  <div className='movie-card-info'>
                    <h3>{Title}</h3>
                    <div className='movie-meta-bottom'>
                      <span className='movie-year'>{Year}</span>
                      
                      {/* Personal rating overlay badge if rated by the user */}
                      {userRating && (
                        <span className="user-rating-badge" title={`You rated this ${userRating} stars`}>
                          <span className="material-symbols-outlined">star</span>
                          {userRating}
                        </span>
                      )}

                      <div className='movie-arrow'>
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Movies