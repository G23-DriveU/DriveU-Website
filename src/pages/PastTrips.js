import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/PastTrips.css';
import { Avatar, IconButton, Rating } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

const PastTrips = () => {
  // const [pastTrips, setPastTrips] = useState([]);
  const [driverTrips, setDriverTrips] = useState([]);
  const [riderTrips, setRiderTrips] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  // const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

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
          // console.log('Rider Trips:', response.data.riderTrips); // Debugging
          // console.log('Driver Trips:', response.data.driverTrips); // Debugging
        } catch (error) {
          console.error('Error fetching past trips:', error);
        }
      }
    };

    fetchPastTrips();
  }, [userInfo]);

  const handleViewDetails = (trip, event) => {
    setSelectedTrip(trip);
  };

  const handleCloseDetails = () => {
    setSelectedTrip(null);
    setShowRatingModal(false);
  };

  if (driverTrips.length === 0 && riderTrips.length === 0) {
    return <div className="no-trips-found"><strong>No trips found.</strong></div>;
  }

  const getProfilePictureUrl = () => {
    if (!firebaseUid) return null;
    return `${process.env.REACT_APP_BACKEND_URL}/uploads/${firebaseUid}.jpeg`;
  };

  const handleRate = async (rating) => {
    try {
      const isDriver = selectedTrip.driverId === userInfo?.id;
      const endpoint = isDriver
        ? `${process.env.REACT_APP_BACKEND_URL}/rateRider`
        : `${process.env.REACT_APP_BACKEND_URL}/rateDriver`;
  
      await axios.post(endpoint, {
        driverId: isDriver ? selectedTrip.driverId : null,
        riderId: isDriver ? null : selectedTrip.riderId,
        rating,
        tripId: selectedTrip.id,
      });
  
      alert('Rating submitted successfully!');
      handleCloseDetails();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
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
        <>
        <div
          className="overlay"
          onClick={handleCloseDetails}
        ></div>
        <div className="trip-popover">
          <div className="popover-header">
            <Avatar
              alt={userInfo.name}
              src={getProfilePictureUrl()}
              sx={{ width: 100, height: 100 }}
            >
              {userInfo.name?.charAt(0)}
            </Avatar>
            <img
              className="google-maps-preview"
              src={`https://maps.googleapis.com/maps/api/staticmap?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&size=200x100&markers=color:blue|label:S|${encodeURIComponent(
                selectedTrip.startLocation
              )}&markers=color:red|label:D|${encodeURIComponent(
                selectedTrip.destination
              )}&path=color:0x0000ff|weight:5|${encodeURIComponent(
                selectedTrip.startLocation
              )}|${encodeURIComponent(selectedTrip.destination)}`}
              alt="Route Map"
            />
          </div>
          
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
              <p><strong>You Made:</strong> {"$" + selectedTrip.driverPayout || '0'}</p>
              <button
                disabled={selectedTrip.driverRated}
                onClick={() => setShowRatingModal(true)}
              >
                Rate
              </button>
            </>
          ) : (
            <>
              <p><strong>Driver:</strong> {selectedTrip.driver?.name || 'N/A'}</p>
              <p><strong>Car:</strong> {selectedTrip.driver.carMake + " " + selectedTrip.driver.carModel}</p>
              <p><strong>This Ride Cost You:</strong> {"$" + (selectedTrip.riderCost || '0').toFixed(2)}</p>
              <button
                disabled={selectedTrip.riderRated}
                onClick={() => setShowRatingModal(true)}
              >
                Rate
              </button>
            </>
          )}
          {showRatingModal && (
            <div className="rating-modal">
              <h3>Rate Your {selectedTrip.driverId === userInfo?.id ? 'Rider' : 'Driver'}</h3>
              <Rating
                name="trip-rating"
                precision={0.5}
                onChange={(event, value) => handleRate(value)}
              />
              <button onClick={() => setShowRatingModal(false)}>Cancel</button>
            </div>
          )}
          <button onClick={handleCloseDetails} style={{ marginTop: '10px' }}>Close</button>
        </div>
        </>
      )}
    </div>
  );
};

export default PastTrips;