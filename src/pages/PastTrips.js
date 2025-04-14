import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/PastTrips.css';
import { Avatar, IconButton, Rating } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PastTrips = () => {
  // const [pastTrips, setPastTrips] = useState([]);
  const [driverTrips, setDriverTrips] = useState([]);
  const [riderTrips, setRiderTrips] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [encodedPolyline, setEncodedPolyline] = useState('');
  // const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchUserInfo = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setFirebaseUid(user.uid);
          try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
              params: {
                firebaseUid: user.uid,
              },
            });
            setUserInfo(response.data.user);
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        } else {
          console.error('No user is signed in');
        }
      });
    };
  
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchPastTrips = async () => {
      if (userInfo) {
        try {
          setLoading(true);
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
        } finally {
          setLoading(false);
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

  if (loading) {
    return <div className="loading"><strong>Loading...</strong></div>;
  }

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
      ? `${process.env.REACT_APP_BACKEND_URL}/rateRider?riderId=${selectedTrip.riderId}&rating=${rating}&tripId=${selectedTrip.id}`
      : `${process.env.REACT_APP_BACKEND_URL}/rateDriver?driverId=${selectedTrip.driverId}&rating=${rating}&tripId=${selectedTrip.id}`;

      // console.log('Rating endpoint:', endpoint); // Debugging

      await axios.put(endpoint);
    
      toast.success('Rating submitted successfully!');

      if (isDriver) {
        setDriverTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip.id === selectedTrip.id ? { ...trip, riderRated: true } : trip
          )
        );
      } else {
        setRiderTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip.id === selectedTrip.id ? { ...trip, driverRated: true } : trip
          )
        );
      }
      handleCloseDetails();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  return (
    <div className="past-trips-container">
      <h1><strong>Past Trips</strong></h1>
      {driverTrips.length > 0 && (
        <>
          <h2>Driver Trips</h2>
          <div className="trips-list">
            {driverTrips.map((trip, index) => (
              <div key={index} className="trip-item">
                <p>Your Trip to {trip.destination}</p>
                <div className="trip-actions">
                  <IconButton
                    size="small"
                    onClick={(e) => handleViewDetails(trip, e)}
                    aria-label="View Details"
                  >
                    <InfoOutlineIcon fontSize="small" />
                  </IconButton>
                  {!trip.riderRated && (
                    <span className="unrated-badge" title="You haven't rated this trip yet!">!</span>
                  )}
                </div>
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
                <div className="trip-actions">
                  <IconButton
                    size="small"
                    onClick={(e) => handleViewDetails(trip, e)}
                    aria-label="View Details"
                    title="View Trip Details"
                  >
                    <InfoOutlineIcon fontSize="small" />
                  </IconButton>
                  {!trip.driverRated && (
                    <span className="unrated-badge" title="You haven't rated this trip yet!">!</span>
                  )}
                </div>
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
            <iframe
              title="Google Maps Route"
              className="google-maps-preview"
              src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(
                selectedTrip.startLocation
              )}&destination=${encodeURIComponent(
                selectedTrip.destination
              )}&mode=driving`}
              allowFullScreen
            ></iframe>
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
              {!showRatingModal && (
                <button
                  disabled={selectedTrip.riderRated}
                  onClick={() => setShowRatingModal(true)}
                >
                  {selectedTrip.riderRated ? "Already Rated" : "Rate"}
                </button>
              )}
            </>
          ) : (
            <>
              <p><strong>Driver:</strong> {selectedTrip.driver?.name || 'N/A'}</p>
              <p><strong>Car:</strong> {selectedTrip.driver.carMake + " " + selectedTrip.driver.carModel}</p>
              <p><strong>This Ride Cost You:</strong> {"$" + (selectedTrip.riderCost || '0').toFixed(2)}</p>
              {!showRatingModal && (
                <button
                  disabled={selectedTrip.driverRated}
                  onClick={() => setShowRatingModal(true)}
                >
                  {selectedTrip.driverRated ? "Already Rated" : "Rate"}
                </button>
              )}
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
              <button className="cancel-button" onClick={() => setShowRatingModal(false)}>Cancel</button>
            </div>
          )}
          <button onClick={handleCloseDetails} style={{ marginTop: '10px' }}>Close</button>
        </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default PastTrips;