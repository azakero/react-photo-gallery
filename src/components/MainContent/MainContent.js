import React, { useEffect, useState } from 'react';
import styles from './MainContent.module.css';
import Post from './Post/Post';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';


const MainContent = () => {

    const [ posts, setPosts ] = useState([]);

    useEffect(() => {

        const postCollectionRef = collection( db, 'posts' );
        const q                 = query( postCollectionRef, orderBy( "timestamp", "desc" ) );

        const unsubscribe       = onSnapshot( q, ( data ) => {

            const dataMapped = data.docs.map( doc => {
                return {
                    id: doc.id,
                    post: doc.data()
                }
            });

            setPosts( dataMapped );

        });

        return () => {
			unsubscribe();
		};

    }, [])

    return (
        <div className={styles.MainContent}>
   
            {
                posts && posts.length !== 0 ? (
                    posts.map(({ id, post }) => {
                        return <Post 
                            key={id}
                            postId={id}
                            userId={post.userId}
                            imageUrl={post.imageUrl}
                            imageFileName={post.imageFileName}
                            fullName={post.fullName}
                            avatar={post.avatar}
                            caption={post.caption}
                            timestamp={post.timestamp} 
                        />
                    })
                ) : ''
            }
           
        </div>
    )
}

export default MainContent;

