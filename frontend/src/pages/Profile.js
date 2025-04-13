import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaKey, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import PageHeader from '../components/common/PageHeader';
import './Profile.css';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadUserDetails();
  }, [currentUser, navigate]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserService.getUserDetails();
      setUserDetails(response.data);
      
      // Initialize form with user details
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || ''
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load user details');
      setLoading(false);
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      
      await UserService.updateUserProfile(formData);
      
      // Update local state and context
      setUserDetails({
        ...userDetails,
        ...formData
      });
      
      // Update current user in context
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          email: formData.email
        });
      }
      
      setUpdateSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setUpdateError(errorMessage);
      console.error(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    try {
      setPasswordError(null);
      setPasswordSuccess(false);
      
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }
      
      await UserService.changePassword(passwordData);
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setPasswordError(errorMessage);
      console.error(err);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Show loading spinner
  if (loading && !userDetails) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading profile...</p>
        </div>
      </Container>
    );
  }

  // Show error message
  if (error) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Profile</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadUserDetails}>Try Again</Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader title="Your Profile" />
      
      <Row>
        <Col lg={4} md={5} className="mb-4 mb-md-0">
          <Card>
            <Card.Body className="text-center p-4">
              <div className="profile-avatar">
                <FaUserCircle size={80} />
              </div>
              <h5 className="mt-3">{userDetails?.username}</h5>
              <p className="text-muted mb-1">{userDetails?.role?.toUpperCase()}</p>
              <p className="text-muted mb-3">
                <FaEnvelope className="me-2" />
                {userDetails?.email}
              </p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">
                    {userDetails?.createdAt 
                      ? new Date(userDetails.createdAt).toLocaleDateString() 
                      : '-'}
                  </span>
                  <span className="stat-label">Member Since</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline-danger" 
                  onClick={handleLogout}
                  className="d-flex align-items-center mx-auto"
                >
                  <FaSignOutAlt className="me-2" /> Sign Out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              {updateSuccess && (
                <Alert variant="success" dismissible onClose={() => setUpdateSuccess(false)}>
                  Profile updated successfully!
                </Alert>
              )}
              
              {updateError && (
                <Alert variant="danger" dismissible onClose={() => setUpdateError(null)}>
                  {updateError}
                </Alert>
              )}
              
              <Form onSubmit={handleUpdateProfile}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleProfileChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleProfileChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={userDetails?.username || ''}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Username cannot be changed.
                  </Form.Text>
                </Form.Group>
                
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Change Password</h5>
            </Card.Header>
            <Card.Body>
              {passwordSuccess && (
                <Alert variant="success" dismissible onClose={() => setPasswordSuccess(false)}>
                  Password changed successfully!
                </Alert>
              )}
              
              {passwordError && (
                <Alert variant="danger" dismissible onClose={() => setPasswordError(null)}>
                  {passwordError}
                </Alert>
              )}
              
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters long.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button type="submit" variant="primary">
                  <FaKey className="me-2" /> Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;