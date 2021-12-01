import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Login.module.css';
import { isModalOpen } from '../../../actions/modalAction';
import { getUser } from '../../../actions/userAction';
import Modal from '../../UI/Modal/Modal';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword  } from 'firebase/auth';
import Loader from '../../UI/Loader/Loader';


const Login = () => {

    const dispatch = useDispatch();

    const [ email, setEmail ]       = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ loader, setLoader ]     = useState( false );
    const [ error, setError ]       = useState( '' );

    const currentModalState      = useSelector( state => state.currentModalState );
    const { modalStateRegister, modalStateLogin } = currentModalState;

    const handleLoginModal = () => {
        dispatch( isModalOpen( {
            modalStateImageUpload: {
                isOpen: false
            },
            modalStateRegister: {
                isOpen: false
            },
            modalStateLogin: {
                isOpen: !modalStateLogin.isOpen
            }
        } ) );
    }

    const handleRegisterModal = () => {
        dispatch( isModalOpen( {
            modalStateImageUpload: {
                isOpen: false
            },
            modalStateRegister: {
                isOpen: !modalStateRegister.isOpen
            },
            modalStateLogin: {
                isOpen: false 
            }
        } ) );
    }

    const loginSubmitHandler = ( e ) => {
        e.preventDefault();

        if ( !email || !password ) {
            setError( 'Email and/or Password is invalid!' );
            setLoader( false );
            return;
        }

        signInWithEmailAndPassword( auth, email, password )
            .then( res => {

                dispatch( getUser({
                    id: res.user.uid,
                    displayName: res.user.displayName,
                    avatar: res.user.photoURL,
                    email: res.user.email,
                }) );

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

                setLoader( false );

            })
            .catch( err => {
                console.log( err.message );
                setLoader( false );
                setError( 'Login Failed. Please try again!' );
            });
    }

    useEffect( () => {
        setTimeout(() => {
            setError( '' );
        }, 3000 );
    }, [ error ] );
    
    return (
        <div className={styles.Login}>

            <button className={styles.modalBtn} onClick={handleLoginModal}>
                Login
            </button>

            <Modal
				modalState={modalStateLogin.isOpen}
			>
             
                <div className={styles.container}>

                    {
                        loader ? ( 
                            <Loader />
                        ) : (

                            <>
                                <h3>Login</h3>

                                <form onSubmit={loginSubmitHandler}>

                                    <input 
                                        type='text' 
                                        placeholder='Email'
                                        value={email}
                                        onChange={( e ) => setEmail( e.target.value )}  
                                    />

                                    <input 
                                        type='password' 
                                        placeholder='Password'
                                        value={password}
                                        onChange={( e ) => setPassword( e.target.value )}  
                                    />

                                    <span>{error}</span>

                                    <button type='submit' className={styles.submitBtn}>Login</button>
                                </form>

                                <p>
                                    Don't have an account?
                                    <button onClick={handleRegisterModal}>Register</button>
                                </p>
                            </>

                        )
                    }
                    
                </div>
                  
            </Modal>

        </div>
    )
}

export default Login;
