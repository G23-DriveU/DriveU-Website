import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {

        const user = auth.currentUser;

        if (user) {
          const firebaseUid = user.uid;
          const profilePictureUrl = `${process.env.REACT_APP_BACKEND_URL}/uploads/${firebaseUid}.jpeg`;
          setProfilePicture(profilePictureUrl);
        } else {
          console.error('No user is signed in');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfilePicture();
      } else {
        setProfilePicture(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProfileContext.Provider value={{ profilePicture, setProfilePicture }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);