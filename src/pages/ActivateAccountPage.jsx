import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { activateAccount } from '../services/auth.services';

export const ActivateAccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Activating...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setMessage('ERROR: Email or Token missing.');
      setError(true);
      return;
    }

    const performActivation = async () => {
      try {

        const data = await activateAccount(email, token);
        setMessage(data.message || 'Account activated. Please log in.');
        setError(false);
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Aktivacija nije uspela.';
        setMessage(`ERROR: ${errorMessage}`);
        setError(true);
      }
    };
    performActivation();
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Account Activation</h1>
      <p style={{ color: error ? 'red' : 'green', fontSize: '1.2rem' }}>
        {message}
      </p>
      {!error && <p>Redirecting...</p>}
      {error && (
        <Link to="/login" style={{ marginTop: '1rem' }}>
          Login
        </Link>
      )}
    </div>
  );
};

export default ActivateAccountPage;