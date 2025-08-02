import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
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

const RatingManagement = () => {
  return (
    <Container>
      <Header>
        <Title>Rating Management</Title>
        <Subtitle>View and manage your ratings</Subtitle>
      </Header>
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Rating Management</h3>
        <p>This page will show user ratings and allow store owners to view ratings for their stores.</p>
      </div>
    </Container>
  );
};

export default RatingManagement; 