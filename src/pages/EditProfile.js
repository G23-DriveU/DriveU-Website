import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const [firebaseUid, setFirebaseUid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [school, setSchool] = useState('');
  const [driver, setDriver] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [carCapacity, setCarCapacity] = useState('');
  

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFirebaseUid(user.uid);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      firebaseUid,
      name,
      email,
      phoneNumber,
      school,
      driver: driver === 'yes' ? 'true' : 'false',
      carColor: driver === 'yes' ? carColor : '',
      carPlate: driver === 'yes' ? carPlate : '',
      carMake: driver === 'yes' ? carMake : '',
      carModel: driver === 'yes' ? carModel : '',
      carCapacity: driver === 'yes' ? carCapacity : ''
    }).toString();

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = `${backendUrl}/users?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: 'POST', // Change to 'POST' if your API expects a POST request
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('User profile saved successfully');
      } else {
        console.error('Failed to save user profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="editProfile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Phone Number: </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <label>School: </label>
        <input
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          required
        />
        <label>Driver: </label>
        <select
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {driver === 'yes' && (
          <>
            <label>Car Make: </label>
            <input
              type="text"
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              required
            />
            <label>Car Model: </label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
            />
            <label>Car Color: </label>
            <input
              type="text"
              value={carColor}
              onChange={(e) => setCarColor(e.target.value)}
              required
            />
            <label>Car Plate: </label>
            <input
              type="text"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
              required
            />
            <label>Car Capacity: </label>
            <input
              type="number"
              value={carCapacity}
              onChange={(e) => setCarCapacity(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;