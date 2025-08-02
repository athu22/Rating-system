import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styled from 'styled-components';
import { FaStar, FaStore, FaUsers, FaChartLine } from 'react-icons/fa';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

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
  margin-bottom: 0.5rem;
`;

const RatingCard = styled.div`
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 1rem;
  background: #f8f9fa;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const UserEmail = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Comment = styled.p`
  margin: 0.5rem 0 0 0;
  font-style: italic;
  color: #555;
  font-size: 0.9rem;
`;

const DateInfo = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const StoreOwnerDashboard = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery(
    'storeOwnerDashboard',
    async () => {
      const response = await api.get('/dashboard');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <div>Error loading dashboard: {error.message}</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Store Owner Dashboard</Title>
        <Subtitle>Manage your stores and view customer ratings</Subtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#3498db">
            <FaStore />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.totalStores || 0}</StatValue>
            <StatLabel>Total Stores</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#27ae60">
            <FaStar />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.totalRatings || 0}</StatValue>
            <StatLabel>Total Ratings</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#f39c12">
            <FaChartLine />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.averageRating || '0.0'}</StatValue>
            <StatLabel>Average Rating</StatLabel>
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
                <RatingCard key={rating.id}>
                  <UserInfo>
                    <UserAvatar>
                      {rating.user_name?.charAt(0)?.toUpperCase() || 'U'}
                    </UserAvatar>
                    <div>
                      <UserName>{rating.user_name}</UserName>
                      <UserEmail>{rating.user_email}</UserEmail>
                    </div>
                  </UserInfo>
                  
                  <RatingInfo>
                    <FaStar style={{ color: '#f39c12' }} />
                    <span>{rating.rating}/5 stars</span>
                    <span>•</span>
                    <span>{rating.store_name}</span>
                  </RatingInfo>
                  
                  {rating.comment && (
                    <Comment>"{rating.comment}"</Comment>
                  )}
                  
                  <DateInfo>
                    Rated on {new Date(rating.created_at).toLocaleDateString()}
                  </DateInfo>
                </RatingCard>
              ))
            ) : (
              <EmptyState>
                <p>No ratings yet. Encourage customers to rate your stores!</p>
              </EmptyState>
            )}
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Your Stores</SectionTitle>
          </SectionHeader>
          <SectionContent>
            {dashboardData?.storesWithRatings?.length > 0 ? (
              dashboardData.storesWithRatings.map((store) => (
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
                <p>No stores found. Contact admin to add your stores.</p>
              </EmptyState>
            )}
          </SectionContent>
        </Section>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default StoreOwnerDashboard; 