import React, {useState, useEffect, useContext} from "react";
import {UserContext} from "../../App"

const Profile = ()=> {
    
    const [userPost, setUserPost] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
 
    
    useEffect(()=> {
        fetch("/profile",{
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            // console.log(result)
            setUserPost(result.userPosts)
        })

    }, [userPost])

  useEffect(()=> {
      if(image){
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "anurag-instaClone")
        data.append("cloud_name", "anurag-cloud")
        
        //http request to cloudinary
        fetch("https://api.cloudinary.com/v1_1/anurag-cloud/image/upload",{
            method:"POST",
            body:data
        })
        .then(res=>res.json())
        .then(data=> {
            // localStorage.setItem("user", JSON.stringify({...state, photo: data.url}))
            // dispatch({type: "UPDATEPHOTO", payload: data.url})
            fetch("/updatephoto", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    photo: data.url
                })
            }).then(res=>res.json())
            .then(result=> {
                console.log(result);
                localStorage.setItem("user", JSON.stringify({...state, photo: result.photo}))
                dispatch({type: "UPDATEPHOTO", payload: result.photo})
            })
        })
        .catch(err=> {
            console.log(err);
        })
      }

  }, [image])

    const updateProfile = (file)=> {
        setImage(file)
    }


    return(
        <div style={{maxWidth:"80%", margin:"0px auto"}}>
       
            <div style={{
                display: "flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
        
                <div>
                    <img alt="displayProfile" style={{width:"140px", heigth:"140px", borderRadius:"70px"}}
                    src={state ? state.photo : "...loading"}
                    />

            <div className="file-field input-field">
                   
                    <div className="file-path-wrapper">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Picture</span>
                        <input 
                        type="file"
                        onChange={(e)=>updateProfile(e.target.files[0])}
                        />
                    </div>
                    </div>
                </div>


                </div>
                <div>
                    <h4>{state ? state.name : "...Loading"}</h4>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>{userPost.length} posts</h6>
                        <h6>{state ? state.followers.length : "0"} followers</h6>
                         <h6>{state ? state.following.length : "0"} following</h6>
                    </div>
                </div>
            </div>
        <div className="gallery">
        {
            userPost.map(item=> {
                return <img key={item._id} alt={item.title} className="item" src={item.photo} />

            })
        }
        </div>
        </div>
    )
}


export default Profile