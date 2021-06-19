import React, {useState, useEffect, useContext} from "react";
import {UserContext} from "../../App"
import {useParams} from "react-router-dom"

const Profile = ()=> {
    
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.followers.includes(userId) : true)
    
    // console.log(userId);

    useEffect(()=> {
        fetch(`/user/${userId}`,{
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            // console.log(result);
            
            setUserProfile(result)
        })

    }, [])



    const FollowUser = ()=> {
        fetch("/follow", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId:userId
            })

        }).then(res=>res.json())
        .then(data=> {
            
            dispatch({type: "UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile(prevState=> {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                }
            })
           
            setShowFollow(false)
        })
    }




    const UnFollowUser = ()=> {
        fetch("/unfollow", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId:userId
            })

        }).then(res=>res.json())
        .then(data=> {
           
            dispatch({type: "UPDATE", payload:{following:data.following, followers:data.followers}})
           
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile(prevState=> {
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
           
            setShowFollow(true)
            
        })
    }


    return(
        <>
        {
            userProfile ?
            <div style={{maxWidth:"80%", margin:"0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img alt="displayProfile" style={{width:"140px", heigth:"140px", borderRadius:"70px"}}
                    src={userProfile.user.photo}
                    />
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>{userProfile.foundPosts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>

                    {
                        showFollow 
                        ? 
                        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
 onClick={()=>FollowUser()}
 >
   Follow
  </button>
:
<button className="btn waves-effect waves-light #64b5f6 blue darken-1"
 onClick={()=>UnFollowUser()}
 >
   Unfollow
  </button>
    }



                </div>
            </div>
        <div className="gallery">
        {
            userProfile.foundPosts.map(item=> {
                return <img key={item._id} alt={item.title} className="item" src={item.photo} />

            })
        }
        </div>
        </div>
         : 
         <h2>....Loading</h2>
         }

        </>
    )
}


export default Profile