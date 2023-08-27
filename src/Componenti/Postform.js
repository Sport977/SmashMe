import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMapMarkerAlt, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker'; // Importa il componente DatePicker
import 'react-datepicker/dist/react-datepicker.css'; 
import './postform.css';// Importa lo stile del DatePicker
import { firestore } from './Firebase';

function PostForm({ onPost, user }) {
  const [postText, setPostText] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [searchingFor, setSearchingFor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [radius, setRadius] = useState(10);
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  let newPost = {}; // Aggiungi lo stato per la data
  

  const handleAnonymousToggle = () => {
    setIsAnonymous(!isAnonymous);
  };

  const handleRadiusChange = (event) => {
    setRadius(parseInt(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Handling form submission...");
  
    if (postText.trim() !== '') {
      const newPost = {
        text: postText,
        location: activityLocation,
        username: isAnonymous ? 'Anonimo' : user.username,
        profileImage: isAnonymous ? null : user.profileImage,
        radius: radius,
        searchingFor: searchingFor,
        time: time,
        date: selectedDate,
        userId:user.uid,
      };
      console.log("post:", newPost); // Controlla l'oggetto post creato

    try {
            console.log("Attempting to save post to database...");
            const docRef = await firestore.collection('Posts').add(newPost);
            console.log('Post saved with ID:', docRef.id);

        

        // Reset dei campi del form
        setPostText('');
        setActivityLocation('');
        setSearchingFor('');
        setTime('');
        setSelectedDate(null);
      } catch (error) {
        console.error('Errore durante il salvataggio del post:', error);
      }
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="PostForm">
      <div className="form-header">
        <div className="anonymous-toggle">
          <button type="button" onClick={handleAnonymousToggle}>
            {isAnonymous ? 'Anonimo' : 'Non Anonimo'}
          </button>
        </div>
        <div className="radius-selection">
          <label>Raggio:</label>
          <select value={radius} onChange={handleRadiusChange}>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={30}>30 km</option>
          </select>
        </div>
      </div>
      <div className="flex-container">
        <textarea
          placeholder="Scrivi qualcosa..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
        <div className="location-input">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <input
            type="text"
            placeholder="Luogo di destinazione"
            value={activityLocation}
            onChange={(e) => setActivityLocation(e.target.value)}
          />
        </div>
        <div className="searching-for-input">
          <input
            type="text"
            placeholder="Chi stai cercando?"
            value={searchingFor}
            onChange={(e) => setSearchingFor(e.target.value)}
          />
        </div>
        <div className="time-input">
          <input
            type="number"
            placeholder="Ora (es. 14)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="date-input">
        <FontAwesomeIcon icon={faCalendar} />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Seleziona una data"
          dateFormat="dd/MM/yyyy"
        />
      </div>
      </div>
      <button type="submit">
        <FontAwesomeIcon icon={faPaperPlane} /> Pubblica
      </button>
    </form>
  );
}

export default PostForm;
