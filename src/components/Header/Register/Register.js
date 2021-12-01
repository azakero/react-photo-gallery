import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Register.module.css';
import { isModalOpen } from '../../../actions/modalAction';
import { getUser } from '../../../actions/userAction';
import Modal from '../../UI/Modal/Modal';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword, updateProfile  } from 'firebase/auth';
import Loader from '../../UI/Loader/Loader';


const Register = () => {

    const dispatch = useDispatch();

    const [ fullName, setFullName ] = useState( '' );
    const [ email, setEmail ]       = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ loader, setLoader ]     = useState( false );
    const [ error, setError ] = useState( '' );

    const currentModalState = useSelector( state => state.currentModalState );
    const { modalStateRegister, modalStateLogin } = currentModalState;

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

    const registerSubmitHandler = ( e ) => {
        e.preventDefault();
        setLoader( true );

        if ( !fullName || !email || !password ) {
            setError( 'Name, Email and/or Password is missing!' );
            setLoader( false );
            return;
        }

        createUserWithEmailAndPassword( auth, email, password )
            .then( res => {

                return updateProfile( res.user, {
                    displayName: fullName, 
                }).then( () => {

                    dispatch( getUser({
                        id: res.user.uid,
                        displayName: res.user.displayName,
                        avatar: res.user.photoURL,
                        email: res.user.email,
                    }) );

                    setLoader( false );

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

                }).catch((error) => {
                    console.log( error.message );
                    setLoader( false );
                    setError( 'Failed to update display name!' );
                });

            })
            .catch( err => {
                console.log( err.message );
                setLoader( false );
                setError( 'Registration Failed. Please try again!' );
            });

    }

    useEffect( () => {
        setTimeout(() => {
            setError( '' );
        }, 3000 );
    }, [ error ] );

    return (
        <div className={styles.Register}>

            <button className={styles.modalBtn} onClick={handleRegisterModal}>
                Register
            </button>

            <Modal
				modalState={modalStateRegister.isOpen}
			>
             
                <div className={styles.container}>

                    {
                        loader ? ( 
                            <Loader />
                        ) : (

                            <>
                                <h3>Create an Account</h3>

                                <form onSubmit={registerSubmitHandler}>

                                    <input 
                                        type='text' 
                                        placeholder='Name'
                                        value={fullName}
                                        onChange={( e ) => setFullName( e.target.value )}  
                                    />

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

                                    <button type='submit' className={styles.submitBtn}>Register</button>
                                </form>

                                <p>
                                    Already have an account?
                                    <button onClick={handleLoginModal}>Login</button>
                                </p>
                            </>

                        )
                    }
                    
                </div>
                  
            </Modal>

        </div>
    )
}

export default Register;
