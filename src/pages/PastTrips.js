import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/PastTrips.css';
import { Avatar, IconButton } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

const PastTrips = () => {
  // const [pastTrips, setPastTrips] = useState([]);
  const [driverTrips, setDriverTrips] = useState([]);
  const [riderTrips, setRiderTrips] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      setFirebaseUid(user?.uid);
      if (user) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            params: {
              firebaseUid: user.uid,
            },
          });
          // console.log('User Info API response:', response.data); // Debugging
          setUserInfo(response.data.user);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchPastTrips = async () => {
      if (userInfo) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/trips`, {
            params: {
              userId: userInfo.id,
            },
          });

          setRiderTrips(response.data.riderTrips || []);
          setDriverTrips(response.data.driverTrips || []);
          console.log('Rider Trips:', response.data.riderTrips); // Debugging
          console.log('Driver Trips:', response.data.driverTrips); // Debugging
        } catch (error) {
          console.error('Error fetching past trips:', error);
        }
      }
    };

    fetchPastTrips();
  }, [userInfo]);

  const handleViewDetails = (trip, event) => {
    setSelectedTrip(trip);

    const rect = event.target.getBoundingClientRect();
    setPopoverPosition({
      top: rect.top + window.scrollY + rect.height + 10,
      left: rect.left + rect.width / 2,
    });
  };

  const handleCloseDetails = () => {
    setSelectedTrip(null);
  };

  if (driverTrips.length === 0 && riderTrips.length === 0) {
    return <div>No trips found.</div>;
  }

  const getProfilePictureUrl = () => {
    if (!firebaseUid) return null;
    return `${process.env.REACT_APP_BACKEND_URL}/uploads/${firebaseUid}.jpeg`;
  };

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
                {/* <button onClick={(e) => handleViewDetails(trip, e)}>View Details</button> */}
                <IconButton
                  size="small"
                  onClick={(e) => handleViewDetails(trip, e)}
                  aria-label="View Details"
                >
                  <InfoOutlineIcon fontSize="small" />
                </IconButton>
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
                {/* <button onClick={(e) => handleViewDetails(trip, e)}>View Details</button> */}
                <IconButton
                  size="small"
                  onClick={(e) => handleViewDetails(trip, e)}
                  aria-label="View Details"
                >
                  <InfoOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
        </>
      )}
      {selectedTrip && (
        <div
          className="trip-popover"
          style={{
            position: 'absolute',
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <Avatar
            alt={userInfo.name}
            src={getProfilePictureUrl()}
            sx={{ width: 100, height: 100 }}
          >
            {userInfo.name?.charAt(0)}
          </Avatar>
          <h3>Trip Details</h3>
          <p><strong>Start Location:</strong> {selectedTrip.startLocation}</p>
          <p><strong>Destination:</strong> {selectedTrip.destination}</p>
          {selectedTrip.driverId === userInfo?.id ? (
            <>
              <p><strong>Rider:</strong> {selectedTrip.rider.name || 'N/A'}</p>
              <p>
                <strong>Car:</strong>{' '}
                {userInfo.carMake && userInfo.carModel
                  ? `${userInfo.carMake} ${userInfo.carModel}`
                  : 'Unknown Car'}
              </p>
            </>
          ) : (
            <>
              <p><strong>Driver:</strong> {selectedTrip.driver?.name || 'N/A'}</p>
              <p><strong>Car:</strong> {selectedTrip.driver.carMake + " " + selectedTrip.driver.carModel}</p>
            </>
          )}
          {/* <p><strong>Car:</strong> {selectedTrip.carMake + " " + selectedTrip.carModel}</p> */}
          {selectedTrip.driverId === userInfo?.id && (
            <p><strong>You Made:</strong> {"$" + selectedTrip.driverPayout || '0'}</p>
          )}
          
          {/* <p><strong>You Drove:</strong> {selectedTrip.time}</p> */}
          <button onClick={handleCloseDetails} style={{ marginTop: '10px' }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default PastTrips;