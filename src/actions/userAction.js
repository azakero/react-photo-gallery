import {
    GET_USER,
} from '../constants/constants';


export const getUser = ( data ) => async( dispatch ) => {
    try {

        dispatch( {
            type: GET_USER,
            payload: data
        } );

    } catch ( error ) {

        console.log( 'From Actions: ', error )

    }
}