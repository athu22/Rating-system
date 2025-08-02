import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaEdit, FaTrash, FaSearch, FaSort } from 'react-icons/fa';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import RatingModal from '../components/Store/RatingModal';
import toast from 'react-hot-toast';

// Animation keyframes
const flyUp = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-40px) scale(0.8);
    opacity: 0;
  }
`;

const fadeOut = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
`;

const FlyingStar = styled.div`
  position: fixed;
  color: #e74c3c;
  font-size: 1.5rem;
  animation: ${flyUp} 1.5s ease-out forwards;
  pointer-events: none;
  z-index: 1000;
`;

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
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
  min-width: 200px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const SortSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const RatingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const RatingCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${props => props.isDeleting ? fadeOut : 'none'} 0.5s ease-out forwards;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const RatingHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const StoreName = styled.h3`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const StoreAddress = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 0.9rem;
`;

const RatingBody = styled.div`
  padding: 1.5rem;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f39c12;
`;

const RatingText = styled.span`
  font-weight: 500;
  color: #2c3e50;
  margin-left: 0.5rem;
`;

const RatingDate = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const RatingComment = styled.div`
  background: #f8f9fa;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
  font-style: italic;
  color: #555;
  border-left: 3px solid #3498db;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'delete' ? '#e74c3c' : '#3498db'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.variant === 'delete' ? '#c0392b' : '#2980b9'};
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2980b9' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MyRatings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [flyingStars, setFlyingStars] = useState([]);
  const [deletingRatingId, setDeletingRatingId] = useState(null);

  const { data, isLoading, error } = useQuery(
    ['userRatings', search, sortBy, sortOrder, page],
    async () => {
      const response = await api.get('/ratings/user/me', {
        params: {
          search,
          sortBy,
          sortOrder,
          page,
          limit: 12,
        },
      });
      return response.data;
    },
    {
      keepPreviousData: true,
    }
  );

  const deleteRatingMutation = useMutation(
    async (ratingId) => {
      await api.delete(`/ratings/${ratingId}`);
    },
    {
      onSuccess: (_, ratingId) => {
        // Create flying stars animation
        const stars = [];
        for (let i = 0; i < 3; i++) {
          stars.push({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 0.5,
          });
        }
        setFlyingStars(stars);

        // Clear flying stars after animation
        setTimeout(() => {
          setFlyingStars([]);
        }, 1500);

        toast.success('Rating deleted successfully');
        queryClient.invalidateQueries('userRatings');
      },
      onError: (error) => {
        setDeletingRatingId(null);
        toast.error(error.response?.data?.message || 'Failed to delete rating');
      },
    }
  );

  const handleUpdateRating = (rating) => {
    setSelectedRating(rating);
    setIsRatingModalOpen(true);
  };

  const handleDeleteRating = async (ratingId) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      setDeletingRatingId(ratingId);
      deleteRatingMutation.mutate(ratingId);
    }
  };

  const handleRatingSubmit = () => {
    setIsRatingModalOpen(false);
    setSelectedRating(null);
    queryClient.invalidateQueries('userRatings');
  };

  // Calculate statistics
  const stats = data?.ratings ? {
    totalRatings: data.pagination?.totalRatings || data.ratings.length,
    averageRating: data.ratings.length > 0 
      ? (data.ratings.reduce((sum, rating) => sum + rating.rating, 0) / data.ratings.length).toFixed(1)
      : '0.0',
    recentRatings: data.ratings.filter(rating => {
      const ratingDate = new Date(rating.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return ratingDate > weekAgo;
    }).length
  } : { totalRatings: 0, averageRating: '0.0', recentRatings: 0 };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <div>Error loading ratings: {error.message}</div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Flying stars animation */}
      {flyingStars.map((star) => (
        <FlyingStar
          key={star.id}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <FaStar />
        </FlyingStar>
      ))}

      <Header>
        <Title>My Ratings</Title>
        <Subtitle>Manage and review all your store ratings</Subtitle>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.totalRatings}</StatNumber>
          <StatLabel>Total Ratings</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.averageRating}</StatNumber>
          <StatLabel>Average Rating</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.recentRatings}</StatNumber>
          <StatLabel>This Week</StatLabel>
        </StatCard>
      </StatsContainer>

      <SearchBar>
        <SearchInput>
          <SearchIcon />
          <Input
            type="text"
            placeholder="Search by store name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchInput>

        <SortSelect
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field);
            setSortOrder(order);
            setPage(1);
          }}
        >
          <option value="created_at-DESC">Newest First</option>
          <option value="created_at-ASC">Oldest First</option>
          <option value="rating-DESC">Highest Rated</option>
          <option value="rating-ASC">Lowest Rated</option>
          <option value="store_name-ASC">Store Name A-Z</option>
          <option value="store_name-DESC">Store Name Z-A</option>
        </SortSelect>
      </SearchBar>

      {data?.ratings?.length > 0 ? (
        <>
          <RatingsGrid>
            {data.ratings.map((rating) => (
              <RatingCard 
                key={rating.id} 
                isDeleting={deletingRatingId === rating.id}
              >
                <RatingHeader>
                  <StoreName>{rating.store_name}</StoreName>
                  <StoreAddress>{rating.store_address}</StoreAddress>
                </RatingHeader>
                <RatingBody>
                  <RatingSection>
                    <RatingInfo>
                      <RatingStars>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < rating.rating ? '#f39c12' : '#ddd'}
                          />
                        ))}
                      </RatingStars>
                      <RatingText>{rating.rating}/5</RatingText>
                    </RatingInfo>
                  </RatingSection>

                  <RatingDate>
                    Rated on {new Date(rating.created_at).toLocaleDateString()}
                    {rating.updated_at && rating.updated_at !== rating.created_at && (
                      <span> (Updated on {new Date(rating.updated_at).toLocaleDateString()})</span>
                    )}
                  </RatingDate>

                  {rating.comment && (
                    <RatingComment>
                      "{rating.comment}"
                    </RatingComment>
                  )}

                  <ActionButtons>
                    <ActionButton
                      onClick={() => handleUpdateRating(rating)}
                      disabled={deleteRatingMutation.isLoading}
                    >
                      <FaEdit />
                      Update Rating
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={() => handleDeleteRating(rating.id)}
                      disabled={deleteRatingMutation.isLoading}
                    >
                      <FaTrash />
                      Delete Rating
                    </ActionButton>
                  </ActionButtons>
                </RatingBody>
              </RatingCard>
            ))}
          </RatingsGrid>

          {data.pagination?.totalPages > 1 && (
            <Pagination>
              <PageButton
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </PageButton>
              
              {[...Array(data.pagination.totalPages)].map((_, i) => (
                <PageButton
                  key={i + 1}
                  active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PageButton>
              ))}
              
              <PageButton
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </>
      ) : (
        <EmptyState>
          <h3>No ratings found</h3>
          <p>You haven't rated any stores yet. Start by exploring stores and leaving your first rating!</p>
        </EmptyState>
      )}

      {isRatingModalOpen && selectedRating && (
        <RatingModal
          store={{
            id: selectedRating.store_id,
            name: selectedRating.store_name,
            address: selectedRating.store_address
          }}
          existingRating={selectedRating}
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </Container>
  );
};

export default MyRatings; 