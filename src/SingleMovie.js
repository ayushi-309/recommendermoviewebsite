import React, { useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { API_URL, useGlobalContext } from './context'

const SingleMovie = () => {
  const { id } = useParams()
  const { 
    watchlist, 
    toggleWatchlist, 
    personalRatings, 
    rateMovie, 
    showToast 
  } = useGlobalContext()

  const [isLoading, setIsLoading] = useState(true)
  const [movie, setMovie] = useState("")
  const [recommendations, setRecommendations] = useState([])

  // Fetch recommendations based on first genre of the current movie
  const getRecommendations = async (genre) => {
    try {
      const res = await fetch(`${API_URL}&s=${genre}`)
      const data = await res.json()
      if (data.Response === "True" && data.Search) {
        // Exclude the current movie and take up to 4 recommendations
        const filtered = data.Search
          .filter(item => item.imdbID !== id)
          .slice(0, 4)
        setRecommendations(filtered)
      } else {
        setRecommendations([])
      }
    } catch (error) {
      console.error("Error fetching recommendations", error)
      setRecommendations([])
    }
  }

  const getMovieDetails = async (url) => {
    setIsLoading(true)
    try {
      const res = await fetch(url)
      const data = await res.json()
      console.log("Movie Details:", data)
      
      if (data.Response === "True") {
        setMovie(data)
        setIsLoading(false)
        
        // Fetch recommendations if genre exists
        if (data.Genre && data.Genre !== "N/A") {
          const firstGenre = data.Genre.split(',')[0].trim()
          getRecommendations(firstGenre)
        }
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error fetching details", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Slight delay to avoid unnecessary rapid API requests on route change
    let timerOut = setTimeout(() => {
      getMovieDetails(`${API_URL}&i=${id}`)
    }, 400)

    return () => clearTimeout(timerOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (isLoading) {
    return (
      <div className='loading-wrapper'>
        <div className='spinner'></div>
        <div className='loading-text'>Loading cinematic details...</div>
      </div>
    )
  }

  // Handle case where movie isn't found
  if (!movie || movie.Response === "False") {
    return (
      <div className="error-page-wrapper">
        <h2 className="error-illustration">404</h2>
        <h3 className="error-tag">Movie Not Found</h3>
        <p className="error-desc">We couldn't retrieve details for this movie. It may have been removed or the ID is invalid.</p>
        <NavLink to="/" className="btn-primary">
          <span className="material-symbols-outlined">home</span>
          Return to CineVerse
        </NavLink>
      </div>
    )
  }

  const isBookmarked = watchlist.some(item => item.imdbID === movie.imdbID)
  const genres = movie.Genre && movie.Genre !== "N/A" ? movie.Genre.split(',') : []
  
  // Fetch personal rating for this movie
  const userRating = personalRatings[movie.imdbID] || 0

  // Action helper for Watchlist clicks with floating Toast notification
  const handleWatchlistClick = () => {
    const movieObj = {
      Title: movie.Title,
      imdbID: movie.imdbID,
      Poster: movie.Poster,
      Year: movie.Year,
      Type: movie.Type
    }
    toggleWatchlist(movieObj)
    if (isBookmarked) {
      showToast(`Removed "${movie.Title}" from Watchlist ❌`)
    } else {
      showToast(`Added "${movie.Title}" to Watchlist! 🔖`)
    }
  }

  // Action helper for Share clipboard copy with floating Toast notification
  const handleShareClick = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      showToast("Link copied to clipboard! 🎬")
    } catch (e) {
      showToast("Failed to copy link.")
    }
  }

  return (
    <section className='movie-details-section'>
      {/* Blurred immersive cinematic backdrop */}
      {movie.Poster !== "N/A" && (
        <div 
          className='details-backdrop'
          style={{ backgroundImage: `url(${movie.Poster})` }}
          aria-hidden="true"
        ></div>
      )}

      <div className='details-container'>
        <div className='details-back-header'>
          <NavLink to="/" className="btn-back">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to CineVerse
          </NavLink>
        </div>

        {/* Main Details Panel */}
        <div className='details-card'>
          <div className='details-poster-area'>
            {movie.Poster && movie.Poster !== "N/A" ? (
              <img src={movie.Poster} alt={movie.Title} className='details-poster' />
            ) : (
              <div 
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  background: 'linear-gradient(135deg, #1e1b4b, #311042)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '6.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                  movie_filter
                </span>
                <p style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700 }}>{movie.Title}</p>
                <span style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>No Poster Available</span>
              </div>
            )}

            {/* Float rating over poster */}
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className='details-rating-badge'>
                <span className="material-symbols-outlined">star</span>
                <span>{movie.imdbRating} / 10</span>
              </div>
            )}
          </div>

          <div className='details-content'>
            <h1 className='details-title'>{movie.Title}</h1>

            {/* Genres Row */}
            {genres.length > 0 && (
              <div className='details-genres'>
                {genres.map(genre => (
                  <span key={genre.trim()} className='genre-pill'>
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Plot Box */}
            {movie.Plot && movie.Plot !== "N/A" && (
              <div className='details-plot-box'>
                <h3 className='details-plot-title'>Storyline</h3>
                <p className='details-plot'>{movie.Plot}</p>
              </div>
            )}

            {/* Metadata Info Grid */}
            <div className='details-grid-info'>
              {movie.Released && movie.Released !== "N/A" && (
                <div className='info-item'>
                  <span className='info-label'>Released</span>
                  <span className='info-value'>{movie.Released}</span>
                </div>
              )}
              {movie.Runtime && movie.Runtime !== "N/A" && (
                <div className='info-item'>
                  <span className='info-label'>Runtime</span>
                  <span className='info-value'>{movie.Runtime}</span>
                </div>
              )}
              {movie.Director && movie.Director !== "N/A" && (
                <div className='info-item'>
                  <span className='info-label'>Director</span>
                  <span className='info-value'>{movie.Director}</span>
                </div>
              )}
              {movie.Actors && movie.Actors !== "N/A" && (
                <div className='info-item'>
                  <span className='info-label'>Actors</span>
                  <span className='info-value'>{movie.Actors}</span>
                </div>
              )}
              {movie.Language && movie.Language !== "N/A" && (
                <div className='info-item'>
                  <span className='info-label'>Language</span>
                  <span className='info-value'>{movie.Language}</span>
                </div>
              )}
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <div className='info-item'>
                  <span className='info-label'>Box Office</span>
                  <span className='info-value'>{movie.BoxOffice}</span>
                </div>
              )}
            </div>

            {/* Interactive 5-Star Ratings widget block */}
            <div className="rating-stars-container">
              <span className="rating-label">Rate Title:</span>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${star <= userRating ? 'active' : ''}`}
                    onClick={() => {
                      rateMovie(movie.imdbID, star)
                      showToast(`You rated "${movie.Title}" ${star} Stars! 🌟`)
                    }}
                    title={`Rate ${star} Stars`}
                    aria-label={`Rate ${star} Stars`}
                  >
                    <span className="material-symbols-outlined">star</span>
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffd23f', marginLeft: '0.4rem', fontFamily: 'Outfit' }}>
                  ({userRating} / 5)
                </span>
              )}
            </div>

            {/* Call to Actions */}
            <div className='details-actions'>
              <button 
                className="btn-primary"
                onClick={handleWatchlistClick}
                style={{
                  background: isBookmarked ? 'var(--accent)' : 'linear-gradient(135deg, var(--primary), #7565fc)',
                  boxShadow: isBookmarked ? '0 4px 15px var(--accent-glow)' : '0 4px 15px var(--primary-glow)'
                }}
              >
                <span className="material-symbols-outlined">
                  {isBookmarked ? 'bookmark_added' : 'bookmark_add'}
                </span>
                {isBookmarked ? 'Remove Watchlist' : 'Add to Watchlist'}
              </button>

              <button 
                className="btn-secondary"
                onClick={handleShareClick}
              >
                <span className="material-symbols-outlined">share</span>
                Share Link
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Recommendations Row */}
        {recommendations.length > 0 && (
          <div className='recommendations-section'>
            <h2>
              <span className="material-symbols-outlined">auto_awesome</span>
              More Like This
            </h2>
            <div className='grid grid-4-col'>
              {recommendations.map((recMovie) => {
                const { Title, imdbID, Poster, Year } = recMovie
                return (
                  <NavLink to={`/movie/${imdbID}`} key={imdbID} className="movie-card-link">
                    <div className='movie-card-wrapper' style={{ height: '350px' }}>
                      <div className='poster-container' style={{ height: '260px' }}>
                        {Poster && Poster !== "N/A" ? (
                          <img src={Poster} alt={Title} loading="lazy" />
                        ) : (
                          <div 
                            style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, #1e1b4b, #311042)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '1rem',
                              textAlign: 'center',
                              color: '#fff'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '3.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                              movie_filter
                            </span>
                            <p style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700 }}>{Title}</p>
                          </div>
                        )}
                        <div className='poster-overlay'></div>
                      </div>
                      <div className='movie-card-info' style={{ padding: '1.2rem' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>{Title}</h3>
                        <div className='movie-meta-bottom' style={{ fontSize: '1.2rem' }}>
                          <span className='movie-year' style={{ padding: '0.1rem 0.5rem' }}>{Year}</span>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SingleMovie