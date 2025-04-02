import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setFeedback('Error: ' + err.message);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset} className="form-container">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {feedback && <p style={{ color: feedback.startsWith('Error') ? 'red' : 'green' }}>{feedback}</p>}
    </div>
  );
};

export default ForgotPassword;