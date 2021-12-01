import {
    GET_USER,
} from '../constants/constants';


const initialState = {
    user: {}
}

export const getUserReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case GET_USER:
            return {
                user: action.payload
            }
        default:
            return state
    }

}