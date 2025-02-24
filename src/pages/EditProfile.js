import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/EditProfile.css';
import vehicleModels from './vehicle_models_cleaned.json';
import PayPalLoginButton from '../components/linkPayPal';

const EditProfile = () => {
  const [firebaseUid, setFirebaseUid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [school, setSchool] = useState('');
  const [driver, setDriver] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [modelOptions, setModelOptions] = useState([]);
  const [carColor, setCarColor] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [authCode, setAuthCode] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFirebaseUid(user.uid);
    } else {
      setFirebaseUid(localStorage.getItem('firebaseUid') || '');
      setName(localStorage.getItem('name') || '');
      setEmail(localStorage.getItem('email') || '');
      setPhoneNumber(localStorage.getItem('phoneNumber') || '');
      setSchool(localStorage.getItem('school') || '');
      setDriver(localStorage.getItem('driver') || '');
      setCarMake(localStorage.getItem('carMake') || '');
      setCarModel(localStorage.getItem('carModel') || '');
      setCarColor(localStorage.getItem('carColor') || '');
      setCarPlate(localStorage.getItem('carPlate') || '');
      setAuthCode(localStorage.getItem('authCode') || '');
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setAuthCode(code);
      localStorage.setItem('authCode', code);
    }
  }, []);

  useEffect(() => {
    if (carMake) {
      const selectedMake = vehicleModels.find(make => make.Make === carMake);
      setModelOptions(selectedMake ? selectedMake.Models : []);
    } else {
      setModelOptions([]);
    }
  }, [carMake]);

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
      authCode: driver === 'yes' ? authCode : '',
    }).toString();

    console.log('firebaseUid:', firebaseUid);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = `${backendUrl}/users?${queryParams}`;
    console.log('Request URL:', url);

    try {
      const response = await axios.post(url);
      if (response.status === 201) {
        console.log('User profile saved successfully');
      } else {
        console.error('Failed to save user profile');
        console.log('Response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="editProfile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label>Driver: </label>
        <select
          value={driver}
          onChange={(e) => {
            setDriver(e.target.value);
            localStorage.setItem('driver', e.target.value);
          }}
          required
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        {authCode && (
          <>
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
        </>
        )}
        {driver === 'yes' && !authCode && (
          <PayPalLoginButton 
            onAuthCodeReceived={setAuthCode}
            userInfo={{
              firebaseUid,
              name,
              email,
              phoneNumber,
              school,
              driver,
              carMake,
              carModel,
              carColor,
              carPlate,
            }}
          />
        )}

        {driver === 'yes' && authCode && (
          <>
            <label>Car Make: </label>
            <select value={carMake} onChange={(e) => setCarMake(e.target.value)} required>
              <option value="">Select Car Make</option>
              {vehicleModels.map((make) => (
                <option key={make.Make} value={make.Make}>
                  {make.Make}
                </option>
              ))}
            </select>

            <label>Car Model: </label>
            <select value={carModel} onChange={(e) => setCarModel(e.target.value)} required>
              <option value="">Select Car Model</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

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
          </>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;