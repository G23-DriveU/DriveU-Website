import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            params: {
              firebaseUid: user.uid,
            },
          });
          console.log('API response:', response.data); // Debugging
          setUserData(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigate('/editprofile');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  console.log('User Data:', userData); // Debugging

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
      <p><strong>School:</strong> {userData.school}</p>
      <p><strong>Driver:</strong> {userData.driver ? 'Yes' : 'No'}</p>
      {userData.driver && (
        <>
          <p><strong>Car Make:</strong> {userData.carMake}</p>
          <p><strong>Car Model:</strong> {userData.carModel}</p>
          <p><strong>Car Color:</strong> {userData.carColor}</p>
          <p><strong>Car Plate:</strong> {userData.carPlate}</p>
        </>
      )}
      <button onClick={handleEditProfile}>Edit Profile</button>
    </div>
  );
};

export default Profile;