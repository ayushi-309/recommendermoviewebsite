// context <API> </API>
// useContext hooks


// context(warehouse)
// Provider
// consumer / (useContext())


import React, { useContext, useEffect, useState} from 'react'


export const API_URL = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}`;


const AppContext = React.createContext()

//we need to create a provider function

const AppProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)
    const [movie, setMovie] = useState([])
    const [isError, setIsError] = useState({show: false, msg: ""})
    const [query, setQuery] = useState("harry potter")
    
    // Manage Watchlist State with LocalStorage
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const saved = localStorage.getItem('cineverse_watchlist');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse watchlist", e);
            return [];
        }
    })

    // Navigation Tab state
    const [activeTab, setActiveTab] = useState('explore')

    // Search History State
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('cineverse_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    })

    // Sorting & Filtering state
    const [sortBy, setSortBy] = useState('default')
    const [filterType, setFilterType] = useState('all')

    // Toast State
    const [toast, setToast] = useState(null)
    const showToast = (message) => {
        setToast({ message, id: Date.now() })
    }

    // Personal Ratings State
    const [personalRatings, setPersonalRatings] = useState(() => {
        try {
            const saved = localStorage.getItem('cineverse_ratings');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    })

    // Sync watchlist to localStorage
    useEffect(() => {
        localStorage.setItem('cineverse_watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    // Sync search history to localStorage
    useEffect(() => {
        localStorage.setItem('cineverse_history', JSON.stringify(searchHistory));
    }, [searchHistory]);

    // Sync personal ratings to localStorage
    useEffect(() => {
        localStorage.setItem('cineverse_ratings', JSON.stringify(personalRatings));
    }, [personalRatings]);

    // Add or remove movie from watchlist
    const toggleWatchlist = (movieItem) => {
        setWatchlist((prev) => {
            const exists = prev.some(item => item.imdbID === movieItem.imdbID);
            if (exists) {
                return prev.filter(item => item.imdbID !== movieItem.imdbID);
            } else {
                return [...prev, movieItem];
            }
        });
    }

    // Add query to recent search history
    const addToHistory = (q) => {
        if (!q || q.trim() === "" || q.toLowerCase() === "harry potter") return;
        setSearchHistory((prev) => {
            const filtered = prev.filter(item => item.toLowerCase() !== q.trim().toLowerCase());
            return [q.trim(), ...filtered].slice(0, 5); // Keep last 5 unique queries
        });
    }

    // Clear search history
    const clearHistory = () => {
        setSearchHistory([]);
    }

    // Apply personal rating to movie
    const rateMovie = (imdbID, rating) => {
        setPersonalRatings((prev) => ({
            ...prev,
            [imdbID]: rating
        }));
    }

    const getMovies = async (url) => {
        setIsLoading(true)
        try{
            const res = await fetch(url)
            const data = await res.json()
            console.log(data)
            if(data.Response === "True"){
                setIsLoading(false)
                setIsError({
                     show: false,
                    msg: "",
                })
                setMovie(data.Search || [])
                
                // Automatically save query to search history if successful search
                if (query && query.trim() !== "") {
                    addToHistory(query);
                }
            } else {
                setIsLoading(false)
                setIsError({
                    show: true,
                    msg: data.Error || "No results found",
                })
            }
        } catch (error){
            setIsLoading(false)
            setIsError({
                show: true,
                msg: "Failed to connect to movie server.",
            })
            console.log(error)
        }

    }

    useEffect(() => {
       let timerOut = setTimeout(() => {
            getMovies(`${API_URL}&s=${query}`)
        }, 500);


        return () => clearTimeout(timerOut)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])


    return ( <AppContext.Provider value={{
        isLoading, 
        isError, 
        movie, 
        query, 
        setQuery,
        watchlist,
        toggleWatchlist,
        activeTab,
        setActiveTab,
        searchHistory,
        clearHistory,
        sortBy,
        setSortBy,
        filterType,
        setFilterType,
        personalRatings,
        rateMovie,
        toast,
        showToast
    }}>
        {children}
    </AppContext.Provider>
    )
}

// global custom hook
const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppContext, AppProvider, useGlobalContext}