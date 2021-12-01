import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: '<add-here>',
    authDomain: '<add-here>',
    projectId: '<add-here>',
    storageBucket: '<add-here>',
    messagingSenderId: '<add-here>',
    appId: '<add-here>'
};

const app = initializeApp( firebaseConfig );

const db      = getFirestore( app );
const storage = getStorage( app );
const auth    = getAuth( app );

export { db, storage, auth };