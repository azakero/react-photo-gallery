import React from 'react';
import styles from './Backdrop.module.css';
import { useDispatch } from 'react-redux';
import { isModalOpen } from '../../../actions/modalAction';

const Backdrop = ({ modalState, clicked }) => {

    const dispatch = useDispatch();

    const backdropCloseModal = () => {

        dispatch( isModalOpen( {
            modalStateImageUpload: {
                isOpen: false
            },
            modalStateRegister: {
                isOpen: false
            },
            modalStateLogin: {
                isOpen: false
            }
        } ) );
    }

    return (
        modalState ? 
        <div className={styles.Backdrop} onClick={clicked ? clicked : backdropCloseModal} ></div> : 
        null
    )
};

export default Backdrop;