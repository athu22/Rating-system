import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styled from 'styled-components';
import { FaStar, FaSearch, FaSort } from 'react-icons/fa';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import RatingModal from '../components/Store/RatingModal';

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

const StoresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const StoreCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StoreHeader = styled.div`
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

const StoreBody = styled.div`
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
`;

const RatingCount = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const RateButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
`;

const StoreList = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery(
    ['stores', search, sortBy, sortOrder, page],
    async () => {
      const response = await api.get('/stores', {
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

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = () => {
    setIsRatingModalOpen(false);
    setSelectedStore(null);
    // Refetch stores to update ratings
    window.location.reload();
  };

  // Check if user can rate a specific store
  const canRateStore = (store) => {
    if (!user) return false;
    
    // Store owners cannot rate their own stores
    if (user.role === 'store_owner' && store.owner_id === user.id) {
      return false;
    }
    
    return true;
  };

  // Get page title based on user role
  const getPageTitle = () => {
    if (user?.role === 'store_owner') {
      return 'My Stores';
    }
    return 'All Stores';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <div>Error loading stores: {error.message}</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{getPageTitle()}</Title>
        {user?.role === 'store_owner' && (
          <p style={{ color: '#7f8c8d', margin: 0 }}>
            View and manage your store ratings
          </p>
        )}
      </Header>

      <SearchBar>
        <SearchInput>
          <SearchIcon />
          <Input
            type="text"
            placeholder={user?.role === 'store_owner' ? "Search your stores..." : "Search stores by name or address..."}
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
          <option value="name-ASC">Name A-Z</option>
          <option value="name-DESC">Name Z-A</option>
          <option value="average_rating-DESC">Highest Rated</option>
          <option value="average_rating-ASC">Lowest Rated</option>
          <option value="total_ratings-DESC">Most Rated</option>
          <option value="total_ratings-ASC">Least Rated</option>
        </SortSelect>
      </SearchBar>

      {data?.stores?.length > 0 ? (
        <>
          <StoresGrid>
            {data.stores.map((store) => (
              <StoreCard key={store.id}>
                <StoreHeader>
                  <StoreName>{store.name}</StoreName>
                  <StoreAddress>{store.address}</StoreAddress>
                  {user?.role === 'store_owner' && store.owner_id === user.id && (
                    <div style={{ 
                      background: '#e8f4fd', 
                      color: '#3498db', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      marginTop: '0.5rem',
                      display: 'inline-block'
                    }}>
                      Your Store
                    </div>
                  )}
                </StoreHeader>
                <StoreBody>
                  <RatingSection>
                    <RatingInfo>
                      <RatingStars>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < Math.floor(store.average_rating) ? '#f39c12' : '#ddd'}
                          />
                        ))}
                      </RatingStars>
                      <div>
                        <RatingText>{store.average_rating}/5</RatingText>
                        <br />
                        <RatingCount>({store.total_ratings} ratings)</RatingCount>
                      </div>
                    </RatingInfo>
                    {user && canRateStore(store) && (
                      <RateButton onClick={() => handleRateStore(store)}>
                        Rate Store
                      </RateButton>
                    )}
                    {user && !canRateStore(store) && user.role === 'store_owner' && (
                      <div style={{ 
                        color: '#7f8c8d', 
                        fontSize: '0.9rem',
                        fontStyle: 'italic'
                      }}>
                        Cannot rate your own store
                      </div>
                    )}
                  </RatingSection>
                </StoreBody>
              </StoreCard>
            ))}
          </StoresGrid>

          {data.pagination.totalPages > 1 && (
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
          <h3>No stores found</h3>
          <p>
            {user?.role === 'store_owner' 
              ? "You don't have any stores yet. Contact an admin to add your stores." 
              : "Try adjusting your search criteria or check back later."
            }
          </p>
        </EmptyState>
      )}

      {isRatingModalOpen && selectedStore && (
        <RatingModal
          store={selectedStore}
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </Container>
  );
};

export default StoreList; 