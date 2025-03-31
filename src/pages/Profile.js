import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/Profile.css';
import universityNames from '../data/us_institutions.json';
import { Avatar } from '@mui/material';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    school: '',
    driver: '',
    carMake: '',
    carModel: '',
    carColor: '',
    carPlate: '',
  });
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [rawPhoneNumber, setRawPhoneNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setFirebaseUid(user.uid);
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            params: {
              firebaseUid: user.uid,
            },
          });

          const userId = response.data.user.id;
          setUserId(userId);

          // console.log('API response:', response.data); // Debugging
          // console.log('User ID:', userId); // Debugging
          if (response.data.user) {
            const rawPhone = response.data.user.phoneNumber || '';
            const formattedPhone = formatPhoneNumber(rawPhone);
            
            setUserData(response.data.user);
            setFormData({
              ...response.data.user,
              phoneNumber: formattedPhone,
              driver: response.data.user.driver ? 'yes' : 'no',
            });
            setRawPhoneNumber(rawPhone);
          } else {
            console.error('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const getProfilePictureUrl = () => {
    if (!firebaseUid) return null;
    return `${process.env.REACT_APP_BACKEND_URL}/uploads/${firebaseUid}.jpeg`;
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  
    setFormData({
      ...userData,
      phoneNumber: formatPhoneNumber(userData.phoneNumber),
      driver: userData.driver ? 'yes' : 'no',
    });
  };

  const formatPhoneNumber = (value) => {
    if (!value) return '';

    const phoneNumber = value.replace(/[^\d]/g, '');
  
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleSaveChanges = async () => {
    try {
      const queryParams = new URLSearchParams({
        userId: userId,
        name: formData.name,
        phoneNumber: rawPhoneNumber,
        school: formData.school,
        driver: formData.driver === 'yes' ? 'true' : 'false',
      });

      if (formData.driver === 'yes') {
        queryParams.append('carColor', formData.carColor);
        queryParams.append('carPlate', formData.carPlate);
        queryParams.append('carMake', formData.carMake);
        queryParams.append('carModel', formData.carModel);
      }

      // const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/users?${queryParams.toString()}`;
      // console.log('Request URL:', requestUrl); // Debugging

      // const response = await axios.put(requestUrl);
      // console.log('Save response:', response.data); // Debugging

      setUserData({
        ...formData,
        driver: formData.driver === 'yes',
      });
  
      setFormData({
        ...formData,
        driver: formData.driver === 'yes' ? 'yes' : 'no',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
      // console.log('Driver status:', formData.driver === 'yes'); // Debugging
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'phoneNumber') {
      const rawNumber = value.replace(/[^\d]/g, '');
      const formattedNumber = formatPhoneNumber(rawNumber);
  
      setRawPhoneNumber(rawNumber);
      setFormData((prevData) => ({
        ...prevData,
        phoneNumber: formattedNumber,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSchoolChange = (e) => {
    const value = e.target.value;
  
    setFormData((prevData) => ({
      ...prevData,
      school: value,
    }));
  
    if (value) {
      const filtered = universityNames
        .map((entry) => entry.institution)
        .filter((name) =>
          typeof name === 'string' && name.toLowerCase().includes(value.toLowerCase())
        );
      setFilteredSchools(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredSchools([]);
      setShowDropdown(false);
    }
  };

  const handleSchoolSelect = (school) => {
    setFormData((prevData) => ({
      ...prevData,
      school: school,
    }));
    setFilteredSchools([]);
    setShowDropdown(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* <img src={getProfilePictureUrl()} alt="Profile" className="profile-picture" /> */}
        <Avatar
          alt={userData.name}
          src={getProfilePictureUrl()}
          sx={{ width: 100, height: 100 }}
        >
          {userData.name?.charAt(0)}
        </Avatar>
        <h2>{userData.name}</h2>
        <button onClick={handleEditProfile} className="edit-button">Edit Profile</button>
      </div>
      <div className="profile-details">
        {isEditing ? (
          <>
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </label>
            <label>
              <strong>Phone Number:</strong>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>School:</strong>
              <div className="dropdown-container">
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleSchoolChange}
              />
              {showDropdown && (
                <ul className="dropdown">
                  {filteredSchools.map((school, index) => (
                    <li key={index} onClick={() => handleSchoolSelect(school)}>
                      {school}
                    </li>
                  ))}
                </ul>
              )}
              </div>
            </label>
            <label>
              <strong>Driver:</strong>
              <select
                name="driver"
                value={formData.driver}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            {formData.driver === 'yes' && (
              <>
                <label>
                  <strong>Car Make:</strong>
                  <input
                    type="text"
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <strong>Car Model:</strong>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <strong>Car Color:</strong>
                  <input
                    type="text"
                    name="carColor"
                    value={formData.carColor}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <strong>Car Plate:</strong>
                  <input
                    type="text"
                    name="carPlate"
                    value={formData.carPlate}
                    onChange={handleChange}
                  />
                </label>
              </>
            )}
            <button id="save" onClick={handleSaveChanges}>Save</button>
            <button id="cancel" onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;