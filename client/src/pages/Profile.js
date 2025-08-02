import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  text-align: center;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2.5rem;
`;

const UserName = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
`;

const UserRole = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const ProfileContent = styled.div`
  padding: 2rem;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: #2c3e50;
`;

const EditButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #2980b9;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  &.error {
    border-color: #e74c3c;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background: #229954;
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const PasswordSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
`;

const PasswordInput = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: #2c3e50;
  }
`;

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: profileData, isLoading, error } = useQuery(
    'profile',
    async () => {
      const response = await api.get('/auth/profile');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm();

  const updateProfileMutation = useMutation(
    async (data) => {
      const response = await api.put('/auth/profile', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        queryClient.invalidateQueries('profile');
        // Update the user context
        updateProfile(data.user);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update profile';
        toast.error(message);
      },
    }
  );

  const changePasswordMutation = useMutation(
    async (data) => {
      await changePassword(data.currentPassword, data.newPassword);
    },
    {
      onSuccess: () => {
        setIsChangingPassword(false);
        resetPassword();
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      },
      onError: (error) => {
        // Error is already handled in the changePassword function
      },
    }
  );

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: profileData?.user?.name || '',
      email: profileData?.user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
    resetPassword();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    changePasswordMutation.mutate(data);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    // Fallback to user data from context if API fails
    const currentUser = user;
    
    if (!currentUser) {
      return (
        <Container>
          <div>Error loading profile: {error.message}</div>
          <p>Please try logging in again.</p>
        </Container>
      );
    }
    
    // Continue with fallback user data
  }

  const currentUser = profileData?.user || user;

  if (!currentUser) {
    return (
      <Container>
        <div>No user data available. Please log in again.</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Profile</Title>
        <Subtitle>Manage your account information</Subtitle>
      </Header>

      <ProfileCard>
        <ProfileHeader>
          <Avatar>
            <FaUser />
          </Avatar>
          <UserName>{currentUser?.name}</UserName>
          <UserRole>{currentUser?.role?.replace('_', ' ')}</UserRole>
        </ProfileHeader>

        <ProfileContent>
          <InfoSection>
            <SectionTitle>
              <FaUser />
              Personal Information
            </SectionTitle>

            {isEditing ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 20,
                        message: 'Name must be at least 20 characters',
                      },
                      maxLength: {
                        value: 60,
                        message: 'Name must be less than 60 characters',
                      },
                    })}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email"
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </FormGroup>

                <ButtonGroup>
                  <SaveButton
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                  >
                    {updateProfileMutation.isLoading ? (
                      <>
                        <LoadingSpinner />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </SaveButton>
                  <CancelButton type="button" onClick={handleCancel}>
                    <FaTimes />
                    Cancel
                  </CancelButton>
                </ButtonGroup>
              </Form>
            ) : (
              <>
                <InfoGrid>
                  <InfoItem>
                    <InfoIcon>
                      <FaUser />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Full Name</InfoLabel>
                      <InfoValue>{currentUser?.name}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FaEnvelope />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Email Address</InfoLabel>
                      <InfoValue>{currentUser?.email}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FaCalendar />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Member Since</InfoLabel>
                      <InfoValue>{formatDate(currentUser?.created_at)}</InfoValue>
                    </InfoContent>
                  </InfoItem>
                </InfoGrid>

                <EditButton onClick={handleEdit}>
                  <FaEdit />
                  Edit Profile
                </EditButton>
              </>
            )}
          </InfoSection>

          <PasswordSection>
            <SectionTitle>
              <FaLock />
              Change Password
            </SectionTitle>

            {isChangingPassword ? (
              <PasswordForm onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.9rem', color: '#6c757d' }}>
                  <strong>Security Note:</strong> Please enter your current password to verify your identity before setting a new password.
                  <br />
                  <small>If you've forgotten your password, please contact your administrator.</small>
                </div>
                <FormGroup>
                  <Label htmlFor="currentPassword">
                    <strong>Current Password *</strong>
                    <small style={{ color: '#6c757d', fontWeight: 'normal' }}> (Required to verify your identity)</small>
                  </Label>
                  <PasswordInput>
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required',
                      })}
                      className={passwordErrors.currentPassword ? 'error' : ''}
                      placeholder="Enter your current password to verify your identity"
                      style={{ borderColor: '#3498db', borderWidth: '2px' }}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </PasswordToggle>
                  </PasswordInput>
                  {passwordErrors.currentPassword && (
                    <ErrorMessage>{passwordErrors.currentPassword.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="newPassword">New Password</Label>
                  <PasswordInput>
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                        },
                      })}
                      className={passwordErrors.newPassword ? 'error' : ''}
                      placeholder="Enter your new password"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </PasswordToggle>
                  </PasswordInput>
                  {passwordErrors.newPassword && (
                    <ErrorMessage>{passwordErrors.newPassword.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <PasswordInput>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: (value) => {
                          const newPassword = watchPassword('newPassword');
                          return value === newPassword || 'Passwords do not match';
                        },
                      })}
                      className={passwordErrors.confirmPassword ? 'error' : ''}
                      placeholder="Confirm your new password"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </PasswordToggle>
                  </PasswordInput>
                  {passwordErrors.confirmPassword && (
                    <ErrorMessage>{passwordErrors.confirmPassword.message}</ErrorMessage>
                  )}
                </FormGroup>

                <ButtonGroup>
                  <SaveButton
                    type="submit"
                    disabled={changePasswordMutation.isLoading}
                  >
                    {changePasswordMutation.isLoading ? (
                      <>
                        <LoadingSpinner />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Change Password
                      </>
                    )}
                  </SaveButton>
                  <CancelButton type="button" onClick={handlePasswordCancel}>
                    <FaTimes />
                    Cancel
                  </CancelButton>
                </ButtonGroup>
              </PasswordForm>
            ) : (
              <EditButton onClick={() => setIsChangingPassword(true)}>
                <FaLock />
                Change Password
              </EditButton>
            )}
          </PasswordSection>
        </ProfileContent>
      </ProfileCard>
    </Container>
  );
};

export default Profile; 