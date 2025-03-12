import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/Profile.css';
import universityNames from '../data/us_institutions.json';

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
  const [userId, setUserId] = useState(null);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

          const userId = response.data.user.id;
          setUserId(userId);

          console.log('API response:', response.data); // Debugging
          if (response.data.user) {
            setUserData(response.data.user);
            setFormData({
              ...response.data.user,
              driver: response.data.user.driver ? 'yes' : 'no',
            });
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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      ...userData,
      driver: userData.driver ? 'yes' : 'no',
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users`, {
        params: {
          userId: userId,
          ...formData,
          driver: formData.driver === 'yes',
        },
      });
      console.log('Paramters:', response.config.params); // Debugging
      console.log('Save response:', response.data); // Debugging
      setUserData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
      console.log('Driver status:', formData.driver === 'yes'); // Debugging
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      school: value,
    }));
    if (value) {
      const filtered = universityNames.filter((name) =>
        typeof name === 'string' && name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSchools(filtered);
      setShowDropdown(true);
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
        <img src={userData.profilePicture || 'default-profile.png'} alt="Profile" className="profile-picture" />
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
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;