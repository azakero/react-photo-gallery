import {
    MODAL_STATE,
} from '../constants/constants';


export const isModalOpen = ( data ) => async( dispatch ) => {
    try {

        dispatch( {
            type: MODAL_STATE,
            payload: data
        } );

    } catch ( error ) {

        console.log( 'From Actions: ', error )

    }
}