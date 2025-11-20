import React, { useState } from 'react';
import { forgotPassword } from '../services/auth.services'; 

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await forgotPassword(email);
      setMessage(data.message || 'Reset password link sent. Please check your email.');
    } catch (err) {
      setMessage('Reset password link sent. Please check your email.');
      console.log("An error has occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Forgoten Password</h2>
      <p>Enter your email.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 15px' }}>
          {loading ? 'Sending...' : 'Send link'}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>
      )}
    </div>
  );
};

export default ForgotPasswordPage;