import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/PastTrips.css';

const PastTrips = () => {
  const [driverTrips, setDriverTrips] = useState([]);
  const [riderTrips, setRiderTrips] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            params: {
              firebaseUid: user.uid,
            },
          });
          // console.log('User API response:', response.data); // Debugging
          setUserId(response.data.user.id);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchPastTrips = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/trips`, {
            params: {
              userId: userId,
            },
          });
          // console.log('Trips API response:', response.data); // Debugging
          setDriverTrips(response.data.driverTrips || []);
          setRiderTrips(response.data.riderTrips || []);
        } catch (error) {
          console.error('Error fetching past trips:', error);
        }
      }
    };

    fetchPastTrips();
  }, [userId]);

  if (driverTrips.length === 0 && riderTrips.length === 0) {
    return <div>No past trips found.</div>;
  }

  return (
    <div className="past-trips-container">
      <h1>Past Trips</h1>
      {driverTrips.length > 0 && (
        <>
          <h2>Driver Trips</h2>
          <div className="trips-list">
            {driverTrips.map((trip, index) => (
              <div key={index} className="trip-item">
                <p>Your Trip to {trip.destination}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {riderTrips.length > 0 && (
        <>
          <h2>Rider Trips</h2>
          <div className="trips-list">
            {riderTrips.map((trip, index) => (
              <div key={index} className="trip-item">
                <p>Your Trip to {trip.destination}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PastTrips;