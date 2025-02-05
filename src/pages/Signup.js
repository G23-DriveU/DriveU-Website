import vehicleModels from '../vehicle_models_cleaned.json';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [modelOptions, setModelOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate('/editprofile');
      }
    });

    // Polling mechanism to check email verification status
    const intervalId = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          navigate('/editprofile');
          clearInterval(intervalId);
        }
      }
    }, 3000); // Check every 3 seconds

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [navigate]);

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
    const eduEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[eE][dD][uU]$/;
    if (!eduEmailRegex.test(email)) {
      alert('Please use a .edu email address.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      alert('Verification email sent! Please verify your email before logging in.');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.message);
    }
  };

  return (
    <div className="signup">
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;