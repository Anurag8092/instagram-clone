import React, {useEffect, createContext, useReducer, useContext} from "react";
import NavBar from "./components/Navbar"
import "./App.css";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom"
import Home from "./components/onScreen/Home"
import Profile from "./components/onScreen/Profile"
import Login from "./components/onScreen/Login"
import SignUp from "./components/onScreen/SignUp"
import CreatePost from "./components/onScreen/CreatePost"
import {reducer, initialState} from "./reducers/userReducer"
import UserProfile from "./components/onScreen/UserProfile"
import FriendPosts from "./components/onScreen/FriendPosts"
//Here we are using context to make use of  state and to detect/use that state in a lot of different components

export const UserContext = createContext()

const Routing = ()=> {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)

  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }else {
      history.push("/login")
    }
  }, [])

  return (
    <div>
     {/* switch will make sure that at a time only one route is active */}
 <Switch>      
    <Route exact path="/">
    <Home />
      </Route>

      <Route path="/login">
    <Login />
      </Route>
    
      <Route path="/signup">
    <SignUp />
      </Route>
    
      <Route exact path="/profile">
    <Profile />
      </Route>
    
      <Route path="/createpost">
    <CreatePost />
      </Route>

      
      <Route path="/profile/:userId">
    <UserProfile />
      </Route>

      <Route path="/followingpost">
    <FriendPosts />
      </Route>

      </Switch>
    </div>
   
  )
}



function App() {
  // dispatch is used to update central state
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    // now we have access to state and dispatch of all the components so that we can use state and dispatch in all child components
    // as we have wrapped the components inside USerContext.Provider 
    <UserContext.Provider value={{state, dispatch}}>
     
   <BrowserRouter>

  <NavBar />
 <Routing />

   </BrowserRouter>
   </UserContext.Provider>

   
    
  );
}

export default App;
