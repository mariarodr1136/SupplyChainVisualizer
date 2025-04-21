import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/auth.service';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    setMessage('');
    setLoading(true);

    if (!username || !password) {
      setMessage('Username and password are required');
      setLoading(false);
      return;
    }

    AuthService.login(username, password)
      .then((data) => {
        setCurrentUser(data);
        navigate('/');
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      });
  };

  return (
    <div className="auth-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body>
                <div className="login-content">
                  <div className="text-center header-spacing">
                    <h2 className="auth-title">Supply Chain Visualizer</h2>
                    <p className="auth-subtitle">Sign in to your account</p>
                  </div>

                  <Form onSubmit={handleLogin}>
                    {message && (
                      <Alert variant="danger" className="mb-4">
                        {message}
                      </Alert>
                    )}

                    <Form.Group className="form-group-spacing">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                      />
                    </Form.Group>

                    <Form.Group className="form-group-spacing">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                      />
                    </Form.Group>

                    <div className="button-spacing">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        className="sign-in-button"
                      >
                        {loading ? 'Loading...' : 'Sign In'}
                      </Button>
                    </div>

                    <div className="text-center footer-spacing">
                      <p>
                        Don't have an account? <Link to="/register">Sign up</Link>
                      </p>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;