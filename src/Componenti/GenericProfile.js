import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from './Firebase'; // Assicurati di importare 'firestore' da Firebase
import './genericprofile.css'; // Assicurati di avere il tuo stile CSS
import Post from './post';
import Navbar from './Navbar';
import Footer from './Footer';

function GenericProfile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userPostLikes, setUserPostLikes] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileDocRef = firestore.collection('profili').doc(userId);
        const profileSnapshot = await profileDocRef.get();
        
        if (profileSnapshot.exists) {
          const profileData = profileSnapshot.data();
          console.log('Profile Data:', profileData);
          setProfileData(profileData);

          const querySnapshot = await firestore.collection('Posts')
            .where('userId', '==', userId)
            .get();

          const userPostsData = [];
          const userLikesData = {};

          for (const doc of querySnapshot.docs) {
            const post = { id: doc.id, ...doc.data() };
            userPostsData.push(post);

            const likeQuerySnapshot = await firestore.collection('Likes')
              .where('postId', '==', post.id)
              .get();

            const likes = [];
            likeQuerySnapshot.forEach((likeDoc) => {
              likes.push({ id: likeDoc.id, ...likeDoc.data() });
            });
            userLikesData[post.id] = likes;
          }

          setUserPosts(userPostsData);
          setUserPostLikes(userLikesData);
          console.log('User Posts:', userPostsData);
          console.log('User Post Likes:', userLikesData);
        
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  function formatDate(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  return (
    <>
    <Navbar />
    <div className='App'>
    <div className="container">
      <div className="profile-card">
        <div className="profile-picture">
          {profileData.fotoProfilo && <img src={profileData.fotoProfilo} alt="Profile" />}
        </div>
        <div className="profile-info">
          <h2>{profileData.username}</h2>
          <div className="label-container">
            <label>Nome:</label>
            <p>{profileData.nome}</p>
          </div>
          <div className="label-container">
            <label>Età:</label>
            <p>{profileData.eta}</p>
          </div>
          <div className="label-container">
            <label>Città:</label>
            <p>{profileData.citta}</p>
          </div>
          <div className="label-container">
            <label>Hobby:</label>
            <p>{profileData.hobby}</p>
          </div>
          <div className="label-container">
            <label>Interessi:</label>
            <p>{profileData.interessi}</p>
          </div>
        <div className="label-container">
          <label>Descrizione:</label>
          <p>{profileData.descrizione}</p>
        </div>
        </div>
      </div>
    </div>
    <div className='feed'>
    {userPosts.map((post) => (
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
        date={new Date(post.date)} 
        likes={userPostLikes[post.id] || []}
        formatDate={formatDate}
      />
      
    ))}
    </div>
    </div>
    <Footer />
  </>
);
}

export default GenericProfile;
