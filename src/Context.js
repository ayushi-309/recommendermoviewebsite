// context <API> </API>
// useContext hooks


// context(warehouse)
// Provider
// consumer / (useContext())


import React, { useContext, useEffect, useState} from 'react'


const API_URL = " http://www.omdbapi.com/?i=tt3896198&apikey=cb59843a&s=titanic"

const AppContext = React.createContext()

//we need to create a provider function

const AppProvider = ({children}) => {

    const [isLoading, setIsLoading] = useState(true)
    const [movie, setMovie] = useState([])

    const getMovies = async(url) => {
        try{
            const res = await fetch(url)
            const data = await res.json()
            console.log(data)
        } catch (error){
            console.log(error)
        }

    }

    useEffect(() => {
        getMovies(API_URL)
        // .then(res => res.json())
        // .then(data => console.log(data))
    }, [])


    return <AppContext.Provider value="HEllo world">
        {children}
    </AppContext.Provider>
}

// global custom hook
const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppContext, AppProvider, useGlobalContext}