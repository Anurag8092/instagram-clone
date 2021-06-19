//useReducer is an alternative for useState and we are using useReducer here because useReducer works with useContext

export const initialState = null


export const reducer = (state, action)=> {
    if(action.type === "USER"){
        return action.payload     //here user details  is comming from Login.js as we dispatched data.user through payload there
    }
    if(action.type === "CLEAR"){
        return null
    }
    if(action.type === "UPDATE"){
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }

    if(action.type === "UPDATEPHOTO"){
        return {
            ...state,
            photo: action.payload
        }
    }
    return state   //whatever the reducer returns will be the updated state
}