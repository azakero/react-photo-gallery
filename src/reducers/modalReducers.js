import {
    MODAL_STATE,
} from '../constants/constants';


const initialState = {
    modalStateImageUpload: {
        isOpen: false
    },
    modalStateRegister: {
        isOpen: false
    },
    modalStateLogin: {
        isOpen: false
    },
    modalStatePost: {
        isOpen: false
    }
}

export const modalReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case MODAL_STATE:
            return action.payload
        default:
            return state
    }

}