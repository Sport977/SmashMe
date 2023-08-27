import React, { useState, useEffect } from 'react';
import Post from './post';
import PostForm from './Postform';
import { firestore} from './Firebase';



function Feed({ user }) {
  const [posts, setPosts] = useState([]);

  const handlePost = (post) => {
    // Aggiungi un controllo per evitare di duplicare il post
    if (!posts.some(existingPost => existingPost.id === post.id)) {
      setPosts((prevPosts) => [post, ...prevPosts]);
    }
  };
  useEffect(() => {
    console.log("Subscribing to posts collection...");
    const unsubscribe = firestore.collection('Posts')
      .where('date', '>=', new Date())
      .orderBy('date', 'asc')
      .onSnapshot((snapshot) => {
        console.log("Received snapshot from database.");
        const fetchedPosts = [];
        snapshot.forEach((doc) => {
          const post = { id: doc.id, ...doc.data(), date: doc.data().date.toDate() };
          fetchedPosts.push(post);
        });
        
        setPosts(fetchedPosts);
      });
  
    return () => {
      console.log("Unsubscribing from posts collection...");
      unsubscribe();
    };
  }, []);

  return (
    <div className="feed">
      <PostForm onPost={handlePost} user={user} />
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          text={post.text}
          location={post.location}
          username={post.username}
          profileImage={post.profileImage}
          radius={post.radius}
          searchingFor={post.searchingFor}
          time={post.time}
          date={post.date}
         
        />
      ))}
    </div>
  );
}

export default Feed;
