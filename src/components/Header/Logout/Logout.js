import React from 'react';
import styles from './Logout.module.css';
import { auth } from '../../../firebase';
import { signOut  } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { getUser } from '../../../actions/userAction';

const Logout = () => {

    const dispatch = useDispatch();

    const signOutHandler = () => {
        dispatch( getUser( {} ) );
        signOut( auth );
    }

    return (
        <div className={styles.Logout}>

            <button className={styles.LogoutBtn} onClick={signOutHandler}>
                Logout
            </button>

        </div>
    )
}

export default Logout;
