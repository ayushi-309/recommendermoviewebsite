import React from 'react'
import Search from './Search'
import Movies from './Movies'
import { useGlobalContext } from './context'
import { NavLink } from 'react-router-dom'

const Home = () => {
  const { 
    movie, 
    isLoading, 
    activeTab, 
    setActiveTab, 
    watchlist, 
    toggleWatchlist 
  } = useGlobalContext()

  // Select the first movie from the search results to dynamically feature at the top!
  const featuredMovie = movie && movie.length > 0 ? movie[0] : null
  const isFeaturedBookmarked = featuredMovie ? watchlist.some(item => item.imdbID === featuredMovie.imdbID) : false

  return (
    <>
      {/* Brand Header & Toggle Navigation Bar */}
      <header className="app-header">
        <NavLink to="/" className="brand" onClick={() => setActiveTab('explore')}>
          <img src={process.env.PUBLIC_URL + '/image.png'} className="brand-logo-img" alt="CineVerse Logo" />
          <h1 className="brand-name">Cine<span>Verse</span></h1>
        </NavLink>

        <nav className="view-tabs" aria-label="Main Navigation">
          <button 
            className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <span className="material-symbols-outlined">explore</span>
            Explore
          </button>
          <button 
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            <span className="material-symbols-outlined">bookmarks</span>
            My Watchlist
            {watchlist.length > 0 && (
              <span 
                style={{ 
                  background: 'var(--accent)', 
                  color: '#fff', 
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '10rem',
                  marginLeft: '0.2rem'
                }}
              >
                {watchlist.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      <main className="container">
        {/* Dynamic Featured Hero Banner */}
        {activeTab === 'explore' && !isLoading && featuredMovie && (
          <section 
            className="hero-banner"
            style={{ 
              backgroundImage: featuredMovie.Poster !== "N/A" 
                ? `url(${featuredMovie.Poster})` 
                : 'linear-gradient(135deg, #1e1b4b, #311042)'
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-tag">
                <span className="material-symbols-outlined">local_fire_department</span>
                Featured {featuredMovie.Type || 'Movie'}
              </div>
              <h2 className="hero-title">{featuredMovie.Title}</h2>
              <div className="hero-meta">
                <span className="hero-rating">
                  <span className="material-symbols-outlined">star</span>
                  <span>Featured Release</span>
                </span>
                <span>•</span>
                <span>{featuredMovie.Year}</span>
                <span>•</span>
                <span style={{ textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 700 }}>{featuredMovie.Type}</span>
              </div>
              <p className="hero-plot">
                Explore this cinematic story. Discover plot highlights, critical reviews, full cast details, and explore more recommendations inside our deep movie metadata network.
              </p>
              <div className="hero-actions">
                <NavLink to={`/movie/${featuredMovie.imdbID}`} className="btn-primary">
                  <span className="material-symbols-outlined">info</span>
                  Explore Details
                </NavLink>
                <button 
                  className="btn-secondary" 
                  onClick={() => toggleWatchlist(featuredMovie)}
                >
                  <span className="material-symbols-outlined">
                    {isFeaturedBookmarked ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                  {isFeaturedBookmarked ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Movie Search Bar */}
        <Search />

        {/* Movie Search Grid Results */}
        <Movies />
      </main>
    </>
  )
}

export default Home