// context <API> </API>
// useContext hooks


// context(warehouse)
// Provider
// consumer / (useContext())

import React from 'react'

const AppContext = React.createContext()

//we need to create a provider function

const AppProvider = ({children}) => {
    return <AppContext.Provider value="HEllo world">
        {children}
    </AppContext.Provider>
}

export {AppContext, AppProvider}