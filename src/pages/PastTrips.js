import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

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
          console.log('User API response:', response.data); // Debugging
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
          console.log('Trips API response:', response.data); // Debugging
          setDriverTrips(response.data.driverTrips || []);
          setRiderTrips(response.data.riderTrips || []);
        } catch (error) {
          console.error('Error fetching past trips:', error);
        }
      }
    };

    fetchPastTrips();
  }, [userId]);

  console.log('Driver Trips:', driverTrips); // Debugging
  console.log('Rider Trips:', riderTrips); // Debugging

  if (driverTrips.length === 0 && riderTrips.length === 0) {
    return <div>No past trips found.</div>;
  }

  return (
    <div>
      <h1>Past Trips</h1>
      {driverTrips.length > 0 && (
        <>
          <h2>Driver Trips</h2>
          <ul>
            {driverTrips.map((trip, index) => (
              <li key={index}>
                <p><strong>Date:</strong> {trip.date}</p>
                <p><strong>Destination:</strong> {trip.destination}</p>
                <p><strong>Distance:</strong> {trip.distance} miles</p>
                <p><strong>Duration:</strong> {trip.duration} minutes</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {riderTrips.length > 0 && (
        <>
          <h2>Rider Trips</h2>
          <ul>
            {riderTrips.map((trip, index) => (
              <li key={index}>
                <p><strong>Date:</strong> {trip.date}</p>
                <p><strong>Destination:</strong> {trip.destination}</p>
                <p><strong>Distance:</strong> {trip.distance} miles</p>
                <p><strong>Duration:</strong> {trip.duration} minutes</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default PastTrips;