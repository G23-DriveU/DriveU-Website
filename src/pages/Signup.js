import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import '../styles/Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const eduEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[eE][dD][uU]$/;
    // if (!eduEmailRegex.test(email)) {
    //   alert('Please use a .edu email address.');
    //   return;
    // }
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
        <button id="signup" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;