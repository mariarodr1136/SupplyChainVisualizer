import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import logo from '../assets/logo.png';
import AuthService from '../services/auth.service';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    setMessage('');
    setLoading(true);
    setSuccessful(false);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    AuthService.register(username, password)
      .then(() => {
        setSuccessful(true);
        setMessage('Registration successful! You can now log in.');
        setLoading(false);
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
        setLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="login-back-link auth-back-link">
          <FaArrowLeft /> Back
        </Link>

        <div className="auth-logo-mark">
          <img src={logo} alt="Nexus logo" />
        </div>

        <div className="login-form-header">
          <h1 className="login-form-title">Create your account</h1>
          <p className="login-form-sub">Join the shared Nexus demo workspace</p>
        </div>

        {message && (
          <Alert variant={successful ? 'success' : 'danger'} className="mb-4">
            {message}
          </Alert>
        )}

        <Form onSubmit={handleRegister} className="login-form">
          <Form.Group className="lf-group">
            <Form.Label className="lf-label">Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
              maxLength="20"
              autoComplete="username"
              placeholder="Pick a username"
              className="lf-input"
            />
          </Form.Group>

          <Form.Group className="lf-group">
            <Form.Label className="lf-label">Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="lf-input"
            />
          </Form.Group>

          <Form.Group className="lf-group">
            <Form.Label className="lf-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="lf-input"
            />
          </Form.Group>

          <Button
            type="submit"
            disabled={loading || successful}
            className="lf-btn-primary"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </Button>

          <p className="auth-switch-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;