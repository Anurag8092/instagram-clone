import React, {useState, useContext} from "react";
import {UserContext} from "../../App"
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css"


const Login = ()=> {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const PostData = ()=> {
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
     M.toast({html:"invalid email", classes:"#d32f2f red darken-2"})
       return   
   }
      fetch("/login",{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body: JSON.stringify({
              password,
              email
          })
      }).then(res=>res.json())
      .then(data=> {
        console.log(data);
          if(data.error){
              M.toast({html: data.error, classes:"#d32f2f red darken-2"})
          }else{
            localStorage.setItem("jwt", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            dispatch({type:"USER", payload:data.user})  //dispatch will send data.user  to useReducer and there it will update the state
            M.toast({html: "LogIn Successfully", classes:"#2e7d32 green darken-3"})
              history.push("/")
           }
      }).catch(err=> {
          console.log(err)
      })
  }

    return(
        <h1>
           <div className="mycard">
           <div className="card auth-card input-field">
          <h2>Instagram</h2>

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          />

           <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          />
 <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
 onClick={()=>PostData()}
 >
   Login
  </button>
  <h6>
    <Link to="/signup">Don't have an account?</Link>
           </h6>

      </div>
           </div>
        </h1>
    )
}


export default Login