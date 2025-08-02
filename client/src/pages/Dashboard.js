import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styled from 'styled-components';
import { FaStar, FaStore, FaChartLine } from 'react-icons/fa';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const DashboardHeader = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: ${props => props.color || '#3498db'};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const StoreCard = styled.div`
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StoreName = styled.h4`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const StoreAddress = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
`;

const StoreRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f39c12;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const Dashboard = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    async () => {
      try {
        const response = await api.get('/dashboard');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardHeader>
          <Title>Welcome back, {user?.name || 'User'}!</Title>
          <Subtitle>Unable to load dashboard data. Please try refreshing the page.</Subtitle>
        </DashboardHeader>
        
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
          <p>Dashboard data could not be loaded.</p>
          <p>Error: {error.message}</p>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Welcome back, {user?.name}!</Title>
        <Subtitle>Here's what's happening with your account</Subtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#3498db">
            <FaStar />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.totalRatings || 0}</StatValue>
            <StatLabel>Total Ratings</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#27ae60">
            <FaChartLine />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.averageRating || '0.0'}</StatValue>
            <StatLabel>Average Rating Given</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Ratings</SectionTitle>
          </SectionHeader>
          <SectionContent>
            {dashboardData?.recentRatings?.length > 0 ? (
              dashboardData.recentRatings.map((rating) => (
                <StoreCard key={rating.id}>
                  <StoreName>{rating.store_name}</StoreName>
                  <StoreAddress>{rating.store_address}</StoreAddress>
                  <StoreRating>
                    <FaStar />
                    {rating.rating}/5
                  </StoreRating>
                  {rating.comment && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      "{rating.comment}"
                    </p>
                  )}
                </StoreCard>
              ))
            ) : (
              <EmptyState>
                <p>No ratings yet. Start rating stores to see them here!</p>
              </EmptyState>
            )}
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Top Rated Stores</SectionTitle>
          </SectionHeader>
          <SectionContent>
            {dashboardData?.topStores?.length > 0 ? (
              dashboardData.topStores.map((store) => (
                <StoreCard key={store.id}>
                  <StoreName>{store.name}</StoreName>
                  <StoreAddress>{store.address}</StoreAddress>
                  <StoreRating>
                    <FaStar />
                    {store.average_rating}/5 ({store.total_ratings} ratings)
                  </StoreRating>
                </StoreCard>
              ))
            ) : (
              <EmptyState>
                <p>No stores available yet.</p>
              </EmptyState>
            )}
          </SectionContent>
        </Section>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 