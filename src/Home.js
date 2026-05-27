import React, {useContext} from 'react'
// import {AppContext} from './context'
import {useGlobalContext} from './Context'


const Home = () => {
    // const name = useContext(AppContext)
    const name = useGlobalContext()
  return <>
    <div>My home page</div>
    <p>{name}</p>
  </>
}

export default Home