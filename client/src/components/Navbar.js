import React, {useContext, useEffect, useRef, useState} from "react"
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
// import M from "materialize-css"
const NavBar = ()=> {
  
    // const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const {state, dispatch} = useContext(UserContext) //state has the details of the user and initially it is null as we aw in useReducer.js file
    const history = useHistory()
    

    // useEffect(()=> {
    //   M.Modal.init(searchModal.current)
    // }, [])




    const renderList = ()=> {
        if(state){
          return [
            // <li key="1"><i data-target="modal1" className="large modal-trigger material-icons" style={{color:"black"}}>search</i></li>,
            <li key="2"><Link to="/profile">Profile</Link></li>,
              <li key="3"><Link to="/createpost">Create Post</Link></li>,
              <li key="4"><Link to="/followingpost">Friends' Post</Link></li>,
              <li key="5"><button className="btn waves-effect waves-light #d50000 red accent-4"
              onClick={()=>{
                localStorage.clear()
                dispatch({type: "CLEAR"})
                history.push("/login")
              }}
              >
                LogOut
               </button></li>
          ]
        }else{
          return [
            <li key="6"><Link to="/login">Login</Link></li>,
              <li key="7"><Link to="/signup">Sign Up</Link></li>
          ]
        }
  

    }



    // const getUsers = (query)=> {
    //   setSearch(query)
    //   fetch("/searchuser", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application-json"
    //     }, 
    //     body: JSON.stringify({
    //       query
    //     })
    //   }).then(res=>res.json())
    //   .then(results=> {
    //     console.log(results)
    //   })
    // }



    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
          {renderList()}
          </ul>
        </div>

         {/* Modal Structure 
  <div id="modal1" class="modal" ref={searchModal} style={{color: "black"}}>
    <div className="modal-content">
    <input
          type="email"
          placeholder="Search"
          value={search}
          onChange={(e)=> getUsers(e.target.value)}
          />
      <ul className="collection">
      <li className="collection-item">Alvin</li>
      <li className="collection-item">Alvin</li>
      <li className="collection-item">Alvin</li>
      <li className="collection-item">Alvin</li>
      <li className="collection-item">Alvin</li>
      <li className="collection-item">Alvin</li>
      <li className="collection-item">Alvin</li>
      <li className="collection-item">Alvin</li>
    </ul>

    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat">Agree</button>
    </div>
  </div>
 */}


      </nav>
    );
}



export default NavBar 