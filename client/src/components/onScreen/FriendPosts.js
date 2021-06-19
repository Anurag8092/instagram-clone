import React, {useEffect, useState, useContext} from "react";
import {UserContext} from "../../App"
import { Link } from "react-router-dom";


const FriendPosts= ()=> {
    const [postList, setPostList] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(()=> {
        fetch("/getfollowingpost",{
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            //  console.log(result)
             setPostList(result.foundPosts)
        })
    }, [])




    //Like Posts
    const LikePost = (id)=> {
        fetch("/like", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result=> {
            // console.log(result);
            const newData = postList.map(item=> {
                if(item._id === result._id){
                    return result
                }else {
                    return item
                }
            })
            setPostList(newData)
        }).catch(err=> {
            console.log(err);
        })
    }


     //UnLike Posts
    const UnLikePost = (id)=> {
        fetch("/unlike", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result=> {
            // console.log(result);
            const newData = postList.map(item=> {
                if(item._id === result._id){
                    return result
                }else {
                    return item
                }
            })
            setPostList(newData)
        }).catch(err=> {
            console.log(err);
        })
    }



    //Post comments
    const postComment = (text, postId)=> {
        fetch("/comment", {
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=> {
            console.log(result);
            const newData = postList.map(item=> {
                if(item._id === result._id){
                    return result
                }else {
                    return item
                }
            })
            setPostList(newData)
        }).catch(err=> {
            console.log(err);
        })
    }



    //Delete Post
    const deletePost = (postId)=> {
        fetch(`/delete/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            console.log(result);
            const newData = postList.filter(item=> {
                return item._id !== result._id
            })
           setPostList(newData)
        })
    }



    return(

        <div className="home">
        {
            postList.map((item, index)=> {
                return (
                    <div className="card home-card">
                <h5><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>  
                {
                item.postedBy._id === state._id
                &&
                <i 
                className="material-icons" 
                style={{float:"right"}}
                onClick={()=>deletePost(item._id)}
                >
                delete
                </i>
                }
               </h5>
                <div className="card-image">
                <img alt={item.title} src={item.photo} />
                </div>
                <div className="card-content">
               
               {
                   item.likes.includes(state._id)
                ?
                <i 
                className="material-icons" 
                style={{color:"red"}}
                onClick={()=>{UnLikePost(item._id)}}
                >
                favorite
                </i>
                :
                <i 
                className="material-icons" 
                style={{color:"red"}}
                onClick={()=>{LikePost(item._id)}}
                >
                favorite_border
                </i>
               }
                    <h6>{item.likes.length} Likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {
                        item.comments.map(comment=> {
                        return (
                <h6 key={comment._id}>
                   <span style={{fontWeight:"500"}}>{comment.postedBy.name}</span> {comment.text}
                {/* {item.postedBy._id === state._id
                &&
                <i 
                className="material-icons" 
                style={{float:"right"}}
                onClick={()=>deleteComment(item._id)}
                >
                delete
                </i>
                } */}
                </h6>
                            )
                 })
          }
                  <form onSubmit={(e)=>{
                      e.preventDefault()
                      postComment(e.target[0].value, item._id)
                  }}>
                  <input type="text" placeholder="add comment"/>

                  </form>
                </div>
            </div>
                );
            })
        }

        </div>
    )
}


export default FriendPosts