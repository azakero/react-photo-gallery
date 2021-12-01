import React, { useEffect } from 'react';
import styles from './Header.module.css';
import Logo from './Logo/Logo';
import ImageUpload from './ImageUpload/ImageUpload';
import Register from './Register/Register';
import Login from './Login/Login';
import { auth } from '../../firebase';
import { onAuthStateChanged  } from 'firebase/auth';
import Logout from './Logout/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../actions/userAction';


const Header = () => {

    const dispatch = useDispatch();

    const currentUser = useSelector( state => state.user );
    const { user }    = currentUser;

    useEffect( () => {

        const unsubscribe = onAuthStateChanged( auth, user => {

            if ( user ) {

                if ( user.displayName !== null ) {
                    dispatch( getUser({
                        id: user.uid,
                        displayName: user.displayName,
                        avatar: user.photoURL,
                        email: user.email,
                    }) );
                }

            } else {

                // User is signed out
                console.log('logged out...');

            }

        }); 

        return () => {
            unsubscribe();
        }

    }, [ dispatch ] );


    return (
        <div className={styles.Header}>
            <div className={styles.Header__leftContainer}>
                <Logo />
                <ImageUpload />
            </div>

            <div className={styles.Header__rightContainer}>

                {
                    Object.keys( user ).length !== 0 ? (
                        <Logout />
                    ) : (
                        <>
                            <Register />
                            <Login />
                        </>
                    )
                }
                
            </div>
        </div>
    )
}

export default Header;
