import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import styled from 'styled-components';
import { FaUsers, FaStore, FaStar, FaChartLine, FaUserPlus, FaStoreAlt } from 'react-icons/fa';
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

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled(Link)`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: ${props => props.color || '#3498db'};
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const ActionDescription = styled.p`
  color: #7f8c8d;
  margin: 0;
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

const UserCard = styled.div`
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const UserRole = styled.span`
  background: ${props => {
    switch (props.role) {
      case 'admin': return '#e74c3c';
      case 'store_owner': return '#f39c12';
      default: return '#27ae60';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: capitalize;
`;

const StoreCard = styled.div`
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 1rem;
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

const StoreOwner = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery(
    'adminDashboard',
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
        <Title>Admin Dashboard</Title>
        <Subtitle>Manage users, stores, and monitor system activity</Subtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#3498db">
            <FaUsers />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.totalUsers || 0}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#27ae60">
            <FaStore />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.totalStores || 0}</StatValue>
            <StatLabel>Total Stores</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#f39c12">
            <FaStar />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.totalRatings || 0}</StatValue>
            <StatLabel>Total Ratings</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#9b59b6">
            <FaChartLine />
          </StatIcon>
          <StatContent>
            <StatValue>{dashboardData?.statistics?.averageRating || '0.0'}</StatValue>
            <StatLabel>Average Rating</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ActionGrid>
        <ActionCard to="/admin/users">
          <ActionIcon color="#3498db">
            <FaUserPlus />
          </ActionIcon>
          <ActionContent>
            <ActionTitle>User Management</ActionTitle>
            <ActionDescription>Add, edit, and manage users across all roles</ActionDescription>
          </ActionContent>
        </ActionCard>

        <ActionCard to="/admin/stores">
          <ActionIcon color="#27ae60">
            <FaStoreAlt />
          </ActionIcon>
          <ActionContent>
            <ActionTitle>Store Management</ActionTitle>
            <ActionDescription>Add, edit, and manage stores in the system</ActionDescription>
          </ActionContent>
        </ActionCard>
      </ActionGrid>

      <ContentGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Users</SectionTitle>
          </SectionHeader>
          <SectionContent>
            {dashboardData?.recentUsers?.length > 0 ? (
              dashboardData.recentUsers.map((user) => (
                <UserCard key={user.id}>
                  <UserAvatar>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                    <UserRole role={user.role}>{user.role.replace('_', ' ')}</UserRole>
                  </UserInfo>
                </UserCard>
              ))
            ) : (
              <EmptyState>
                <p>No users found.</p>
              </EmptyState>
            )}
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Recent Stores</SectionTitle>
          </SectionHeader>
          <SectionContent>
            {dashboardData?.recentStores?.length > 0 ? (
              dashboardData.recentStores.map((store) => (
                <StoreCard key={store.id}>
                  <StoreName>{store.name}</StoreName>
                  <StoreAddress>{store.address}</StoreAddress>
                  <StoreOwner>Owner: {store.owner_name}</StoreOwner>
                </StoreCard>
              ))
            ) : (
              <EmptyState>
                <p>No stores found.</p>
              </EmptyState>
            )}
          </SectionContent>
        </Section>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard; 