import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ImageUpload.module.css';
import { isModalOpen } from '../../../actions/modalAction';
import Modal from '../../UI/Modal/Modal';
import ImageUploading from 'react-images-uploading';
import Loader from '../../UI/Loader/Loader';
import { db, storage } from '../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, Timestamp  } from 'firebase/firestore';


const ImageUpload = () => {

    const dispatch = useDispatch();

    const currentModalState = useSelector( state => state.currentModalState );
    const { modalStateRegister, modalStateLogin, modalStateImageUpload } = currentModalState;

    const currentUser = useSelector( state => state.user );
    const { user }    = currentUser;

    const [ caption, setCaption ]             = useState( '' );
    const [ imageFileName, setImageFileName ] = useState( '' );
    const [ imageUrl, setImageUrl ]           = useState( '' );
    const [ image, setImage ]                 = useState( [] );
    const [ error, setError ]                 = useState( '' );
    const [ loader, setLoader ]               = useState( false );

    const maxNumber               = 1;

    const handleImageModal = () => {
        dispatch( isModalOpen( {
            modalStateImageUpload: {
                isOpen: !modalStateImageUpload.isOpen
            },
            modalStateRegister: {
                isOpen: false
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

    const handleImageUpload = ( imageList, addUpdateIndex ) => {
        setImage( imageList );
        setLoader( true );

        if ( imageList.length !== 0 ) {
    
            const storageRef = ref( storage, `images/${imageList[ 0 ].file.name}` );
            const uploadTask = uploadBytesResumable( storageRef, imageList[ 0 ].file );

            uploadTask.on( 'state_changed', ( snapshot ) => {

            }, ( error ) => {

                setError( 'Failed to upload image. Please try again!' );

            }, () => {

                getDownloadURL( uploadTask.snapshot.ref ).then(( downloadURL ) => {
                    setImageFileName( imageList[ 0 ].file.name );
                    setImageUrl( downloadURL );
                    setLoader( false );
                });

            });
    
        }
    };

    const handleImageRemove = async ( imageList, index, onImageRemove ) => {

        try {

            setLoader( true );

            const deleteRef = ref( storage, `images/${imageList[ index ].file.name}` );

            await deleteObject( deleteRef );
            onImageRemove( index );
            setImageUrl( '' );
            setImage( [] );
            setLoader( false );
            setImageFileName( '' );

        } catch ( err ) {
            setLoader( false );
            setError( 'Something went wrong. Please try again!' );
        }

    }

    const imageUploadSubmitHandler = async ( e ) => {
        e.preventDefault();
        setLoader( true );

        try {

            const postRef = collection( db, 'posts' );
            await addDoc( postRef, {
                avatar: '',
                caption,
                fullName: user.displayName,
                userId: user.id, 
                imageUrl,
                imageFileName,
                timestamp: Timestamp.fromDate( new Date() ).toMillis() 
            });

            setLoader( false );
            setCaption( '' );
            setImageUrl( '' );
            setImage( [] );

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

        } catch ( err ) {
            setLoader( false );
        }

    }

    useEffect( () => {
        setTimeout(() => {
            setError( '' );
        }, 3000 );
    }, [ error ] );

    return (
        <div className={styles.ImageUpload}>

            <button className={styles.modalBtn} onClick={handleImageModal}>
                <img src='./attachmentIcon.svg' alt='Attachment Icon' />
            </button>

            <Modal
				modalState={modalStateImageUpload.isOpen}
			>

                <div className={styles.container}>

                    {
                        loader ? ( 

                            <Loader />

                        ) : Object.keys( user ).length === 0 ? ( 
                            <p>
                                You need to<button onClick={handleLoginModal}>Login</button>or 
                                <button onClick={handleRegisterModal}>Register</button>before you can post an image.
                            </p>
                        ) : (
                            <>
                                <h3>Upload an image</h3>

                                <ImageUploading
                                    value={image}
                                    onChange={handleImageUpload}
                                    maxNumber={maxNumber}
                                >
                                    {({
                                        imageList,
                                        onImageUpload,
                                        onImageRemove,
                                        isDragging,
                                        dragProps,
                                    }) => (

                                        <div className={styles.dragdrop}>

                                            <button
                                                className={styles.uploadBtn}
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                <img src='./uploadIcon.svg' alt='Upload Icon' />
                                                
                                                Click or drag 'n drop an image here...
                                            </button>
                                            
                                            {

                                                imageList.map(( image, index ) => (

                                                    <div key={index} className={styles.uploadedImageContainer}>

                                                        <img src={image['dataURL']} alt="" width="100" />

                                                        <button 
                                                            className={styles.removeBtn} 
                                                            onClick={() => handleImageRemove( imageList, index, onImageRemove )}
                                                        >
                                                            <img src='./deleteIcon.svg' alt='Delete Icon' />
                                                        </button>

                                                    </div>

                                                ))

                                            } 

                                        </div>
                                    )}
                                </ImageUploading>

                                <form onSubmit={imageUploadSubmitHandler}>

                                    <textarea 
                                        placeholder='Write a caption'
                                        value={caption} 
                                        onChange={( e ) => setCaption( e.target.value )}></textarea>

                                    <span>{error}</span>

                                    <button type='submit' className={styles.submitBtn} >Upload</button>

                                </form>
                            </>
                        )
                    }
                    
                </div>

            </Modal>
            
        </div>
    );
};

export default ImageUpload;
