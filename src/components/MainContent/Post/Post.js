import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import styles from './Post.module.css';
import nameShorten from '../../../helpers';
import Modal from '../../UI/Modal/Modal';
import { isModalOpen } from '../../../actions/modalAction';
import moment from 'moment';
import Loader from '../../UI/Loader/Loader';
import { db, storage } from '../../../firebase';
import { ref, deleteObject } from "firebase/storage";
import { collection, doc, addDoc, deleteDoc, query, orderBy, onSnapshot, Timestamp  } from 'firebase/firestore';

const Post = ({ postId, userId,  imageUrl, imageFileName, fullName, avatar, caption, timestamp }) => {

    const dispatch = useDispatch();

    const currentModalState = useSelector( state => state.currentModalState );
    const { modalStateRegister, modalStateLogin } = currentModalState;

    const currentUser = useSelector( state => state.user );
    const { user }    = currentUser;

    const [ image, setImage ]         = useState( null );
    const [ modalShow, setModalShow ] = useState( false );
    const [ comment, setComment ]     = useState( '' );
    const [ comments, setComments ]   = useState( [] );
    const [ loader, setLoader ]       = useState( true );

    const modalCloseHandler = () => {
        setModalShow( false );
        setImage( null )
    }

    const postClickHandler = () => {
        setModalShow( true );
        setImage( imageUrl );
    }

    const commentSubmitHandler = async ( e ) => {
        e.preventDefault();

        const postRef    = collection( db, 'posts' );
        const postDoc    = doc( postRef, postId )
        const commentRef = collection( postDoc, 'comments' );

        await addDoc( commentRef, {
            text: comment,
            fullName: user.displayName,
            userId: user.id,
            avatar: '',
            timestamp:  Timestamp.fromDate( new Date() ).toMillis(), 
        });

    }

    const commentRemoveHandler = async (e , id ) => {

        const postRef    = collection( db, 'posts' );
        const postDoc    = doc( postRef, postId );
        const commentRef = collection( postDoc, 'comments' );
        const commentDoc = doc( commentRef, id )

        await deleteDoc( commentDoc );
    }

    const postRemoveHandler = async ( e, id ) => {

        e.stopPropagation();

        const postRef   = collection( db, 'posts' );
        const postDoc   = doc( postRef, postId );
        const deleteRef = ref( storage, `images/${imageFileName}` );

        await deleteObject( deleteRef );
        await deleteDoc( postDoc );

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
        setModalShow( false ); 
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
        setModalShow( false ); 
    }


    useEffect( () => {

        const postRef    = collection( db, 'posts' );
        const postDoc    = doc( postRef, postId );
        const commentRef = collection( postDoc, 'comments' );
        const q          = query( commentRef, orderBy( "timestamp", "asc" ) );

        const unsubscribe       = onSnapshot( q, ( data ) => {

            const dataMapped = data.docs.map( doc => {
                return {
                    id: doc.id,
                    comment: doc.data()
                }
            });

            setComments( dataMapped );
            setComment( '' );

        });

        return () => {
            unsubscribe();
        };
    
    }, [ postId ] )

    return (
        <div className={styles.PostContainerOuter}>

            <Modal
                modalType='PostModal'
				modalState={modalShow}
                modalClose={modalCloseHandler}
			>
             
                <div className={styles.modalImageContainer} >
                    
                    <button onClick={modalCloseHandler} >X</button>
                    <img src={image} alt={fullName} />

                </div>

                <div className={styles.modalCommentsContainer}>

                        <div className={styles.modalCommentsInfo}>

                            <div className={styles.modalCommentsInfoNameAvatar}>
                                
                                {
                                    avatar ? 
                                    <Avatar className={styles.avatar} src={avatar} round size='38' /> : 
                                    <Avatar className={styles.avatar} name={fullName} round size='38' />
                                }

                                <span>{fullName}</span>
                            </div>

                            <div className={styles.modalCommentsInfoTimestamp}>
                                <span>{moment( new Date( timestamp ) ).fromNow()}</span>     
                            </div>

                        </div>

                        <div className={styles.modalCommentsCaption}>

                            <div className={caption ? styles.modalPostCaption : ''}>
                                <p>{caption}</p>
                            </div>

                            <div className={styles.modalCommentsInputContainer}>

                                {
                                    Object.keys( user ).length === 0 ? ( 
                                        <p>
                                            You need to<button onClick={handleLoginModal}>Login</button> or 
                                            <button onClick={handleRegisterModal}>Register</button> before you can comment.
                                        </p>
                                    ) : (
                                        <form onSubmit={commentSubmitHandler}>
                                            <input 
                                                type="text"
                                                placeholder="Post a comment..."
                                                value={comment}
                                                onChange={ ( e ) => setComment( e.target.value ) }
                                            />
                                            
                                            <button
                                                disabled={!comment}
                                                type="submit"
                                            >
                                                Post
                                            </button>
                                        </form>
                                    )
                                }

                            </div>

                            <div className={styles.modalCommentsDisplayContainer}>

                                {
                                    comments.map( comment => (

                                        <div className={styles.modalCommentsDisplayContainerEach} key={comment.id}>
                                            
                                            {
                                                comment.comment.avatar ? 
                                                <Avatar className={styles.avatar} src={comment.comment.avatar} round size='30' /> : 
                                                <Avatar className={styles.avatar} name={comment.comment.fullName} round size='30' />
                                            }

                                            <div className={styles.modalComment}>
                                                <p>
                                                    <strong>{comment.comment.fullName}</strong> <br /> 
                                                    <span>{comment.comment.text}</span>
                                                </p>
                                                <span className={styles.modalCommentTmestamp}>
                                                    {
                                                        moment( new Date(comment.comment.timestamp)).fromNow()
                                                    }
                                                </span>

                                                {
                                                    ( Object.keys( user ).length !== 0 && user.id === comment.comment.userId ) && (
                                                        <button 
                                                            className={styles.commentRemoveBtn} 
                                                            onClick={( e ) => commentRemoveHandler( e, comment.id )}
                                                        >
                                                            <img src='./deleteIcon.svg' alt='Delete Icon' />
                                                        </button>
                                                    )
                                                }

                                                
                                            </div>
                                        </div>
                                            
                                    ))
                                }

                            </div>

                        </div>

                    </div>
                  
            </Modal>
            
            <div className={styles.Post} onClick={postClickHandler}>
                <div className={styles.imageContainer}>

                    <div style={{display: loader ? "flex" : "none"}} className={styles.PostLoader} >
                        <Loader />
                    </div>  

                    <img 
                        style={{display: loader ? "none" : "block"}}
                        onLoad={ () => setLoader( false ) }
                        src={imageUrl} 
                        alt="" 
                    />

                    {
                        ( Object.keys( user ).length !== 0 && user.id === userId ) && (
                            <button 
                                className={styles.postRemoveBtn} 
                                onClick={( e ) => postRemoveHandler( e, postId )}
                            >
                                <img src='./deleteIcon.svg' alt='Delete Icon' />
                            </button>
                        )
                    }

                    <div className={styles.hoverContent}>

                        <div className={styles.hoverContentStatsContainer}>

                            <div className={styles.hoverContentStats}>

                                {
                                    avatar ? 
                                    <Avatar className={styles.avatar} src={avatar} round size='38' /> : 
                                    <Avatar className={styles.avatar} name={fullName} round size='38' />
                                }

                                {
                                    nameShorten( fullName )
                                }

                            </div>

                            <p className={styles.totalCommentsCount}>
                                {comments.length}
                                <img src='./commentsIcon.svg' alt='Comments Icon' />
                            </p>

                        </div>

                        <div className={styles.hoverContentDate}>
                            <p>
                                { 
                                    moment( new Date( timestamp ) ).fromNow()
                                }
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;







