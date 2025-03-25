import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../firebase';
import '../styles/EditProfile.css';
import vehicleModels from '../data/vehicle_models_cleaned.json';
import universityNames from '../data/us_institutions.json';
import PayPalLoginButton from '../components/linkPayPal';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [school, setSchool] = useState('');
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [driver, setDriver] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [modelOptions, setModelOptions] = useState([]);
  const [carColor, setCarColor] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [authCode, setAuthCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (carMake) {
      const selectedMake = vehicleModels.find(make => make.Make === carMake);
      setModelOptions(selectedMake ? selectedMake.Models : []);
    } else {
      setModelOptions([]);
    }
  }, [carMake]);

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    setSchool(value);
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
    setSchool(school);
    setFilteredSchools([]);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      alert('Verification email sent! Please verify your email before proceeding.');

      const queryParams = new URLSearchParams({
        firebaseUid: user.uid,
        name,
        email,
        phoneNumber,
        school,
        driver: driver === 'yes' ? 'true' : 'false',
        carMake: driver === 'yes' ? carMake : '',
        carModel: driver === 'yes' ? carModel : '',
        carColor: driver === 'yes' ? carColor : '',
        carPlate: driver === 'yes' ? carPlate : '',
        authCode: driver === 'yes' ? authCode : '',
      }).toString();

      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const url = `${backendUrl}/users?${queryParams}`;

      const response = await axios.post(url);
      if (response.status === 201) {
        console.log('User profile saved successfully');
        navigate('/');
      } else {
        console.error('Failed to save user profile');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert(error.message);
    }
  };

  return (
    <div className="signupPage">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          onChange={handleSchoolChange}
          required
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

        <label>Are you signing up as a driver? </label>
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

        <label>Link PayPal: </label>
        {!authCode && (
          <PayPalLoginButton
            onAuthCodeReceived={(code) => setAuthCode(code)}
            userInfo={{
              name,
              email,
              phoneNumber,
              school,
              carMake,
              carModel,
              carColor,
              carPlate,
            }}
          />
        )}
        {authCode && <p>PayPal linked successfully!</p>}

        <button type="submit" disabled={!authCode}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;