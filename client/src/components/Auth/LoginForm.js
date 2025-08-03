import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled, { keyframes } from 'styled-components';
import { FaEye, FaEyeSlash, FaSpinner, FaStore, FaStar, FaUsers } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const LoginPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const LeftSection = styled.div`
  flex: 1;
  color: white;
  padding-right: 4rem;
  animation: ${slideIn} 0.8s ease-out;

  @media (max-width: 768px) {
    display: none;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  opacity: 0.8;

  svg {
    font-size: 1.2rem;
    color: #ffd700;
  }
`;

const FormSection = styled.div`
  flex: 1;
  max-width: 450px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
`;

const FormSubtitle = styled.p`
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2.5rem;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &.error {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
  }

  &::placeholder {
    color: #bdc3c7;
  }
`;

const PasswordInput = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    color: #2c3e50;
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #7f8c8d;
  font-size: 0.9rem;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }
  }
`;

const DemoCredentials = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid #dee2e6;
`;

const DemoTitle = styled.h4`
  color: #495057;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CredentialItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CredentialLabel = styled.span`
  color: #6c757d;
  font-weight: 500;
`;

const CredentialValue = styled.span`
  color: #495057;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`;

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.field, {
            type: 'server',
            message: err.message,
          });
        });
      } else {
        setError('root', {
          type: 'server',
          message: error.response?.data?.message || 'Login failed',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPageContainer>
      <ContentWrapper>
        <LeftSection>
          <WelcomeTitle>Store Rating System</WelcomeTitle>
          <WelcomeSubtitle>
            A powerful platform for managing store ratings and customer feedback. 
            Experience seamless rating management with role-based access control.
          </WelcomeSubtitle>
          <FeaturesList>
            <FeatureItem>
              <FaStore />
              <span>Manage multiple stores efficiently</span>
            </FeatureItem>
            <FeatureItem>
              <FaStar />
              <span>Track ratings and customer feedback</span>
            </FeatureItem>
            <FeatureItem>
              <FaUsers />
              <span>Role-based access control</span>
            </FeatureItem>
          </FeaturesList>
        </LeftSection>

        <FormSection>
          <FormContainer>
            <FormTitle>Welcome Back</FormTitle>
            <FormSubtitle>Sign in to your account to continue</FormSubtitle>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
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
                  placeholder="Enter your email address"
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <PasswordInput>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    className={errors.password ? 'error' : ''}
                    placeholder="Enter your password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                </PasswordInput>
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
              </FormGroup>

              {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FaSpinner className="loading-spinner" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </SubmitButton>
            </Form>

            <RegisterLink>
              Don't have an account? <Link to="/register">Create one here</Link>
            </RegisterLink>

            {/* <DemoCredentials>
              <DemoTitle>Demo Credentials</DemoTitle>
              <CredentialItem>
                <CredentialLabel>Admin:</CredentialLabel>
                <CredentialValue>admin@store-rating.com</CredentialValue>
              </CredentialItem>
              <CredentialItem>
                <CredentialLabel>Store Owner:</CredentialLabel>
                <CredentialValue>storeowner@store-rating.com</CredentialValue>
              </CredentialItem>
              <CredentialItem>
                <CredentialLabel>User:</CredentialLabel>
                <CredentialValue>user@store-rating.com</CredentialValue>
              </CredentialItem>
              <CredentialItem>
                <CredentialLabel>Password:</CredentialLabel>
                <CredentialValue>Admin123! / Store123! / User123!</CredentialValue>
              </CredentialItem>
            </DemoCredentials> */}
          </FormContainer>
        </FormSection>
      </ContentWrapper>
    </LoginPageContainer>
  );
};

export default LoginForm; 