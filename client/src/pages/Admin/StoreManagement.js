import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import styled from 'styled-components';
import { FaStore, FaEdit, FaTrash, FaSearch, FaUser } from 'react-icons/fa';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
`;

const AddButton = styled.button`
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

  &:hover {
    background: #229954;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const StoresGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const StoreCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StoreInfo = styled.div`
  flex: 1;
`;

const StoreName = styled.h3`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const StoreAddress = styled.p`
  color: #7f8c8d;
  margin: 0 0 0.5rem 0;
`;

const StoreOwner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const StoreStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
`;

const StoreActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'edit' ? '#3498db' : '#e74c3c'};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'edit' ? '#2980b9' : '#c0392b'};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;

  &:hover {
    color: #2c3e50;
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
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  &.error {
    border-color: #e74c3c;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
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
  transition: background-color 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
`;

const StoreManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const { data: stores, isLoading, error } = useQuery(
    'stores',
    async () => {
      const response = await api.get('/stores');
      // Handle the nested structure returned by the backend
      return response.data.stores || response.data || [];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: users } = useQuery(
    'users',
    async () => {
      const response = await api.get('/users');
      // Handle the nested structure returned by the backend
      return response.data.users || response.data || [];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const createStoreMutation = useMutation(
    async (data) => {
      const response = await api.post('/stores', data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Store created successfully!');
        setShowModal(false);
        reset();
        queryClient.invalidateQueries('stores');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create store';
        toast.error(message);
      },
    }
  );

  const updateStoreMutation = useMutation(
    async ({ id, data }) => {
      const response = await api.put(`/stores/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Store updated successfully!');
        setShowModal(false);
        setEditingStore(null);
        reset();
        queryClient.invalidateQueries('stores');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update store';
        toast.error(message);
      },
    }
  );

  const deleteStoreMutation = useMutation(
    async (id) => {
      await api.delete(`/stores/${id}`);
    },
    {
      onSuccess: () => {
        toast.success('Store deleted successfully!');
        queryClient.invalidateQueries('stores');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete store';
        toast.error(message);
      },
    }
  );

  const handleAddStore = () => {
    setEditingStore(null);
    reset();
    setShowModal(true);
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setValue('name', store.name);
    setValue('address', store.address);
    setValue('owner_id', store.owner_id);
    setShowModal(true);
  };

  const handleDeleteStore = (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      deleteStoreMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingStore) {
      updateStoreMutation.mutate({ id: editingStore.id, data });
    } else {
      createStoreMutation.mutate(data);
    }
  };

  const filteredStores = stores?.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const storeOwners = users?.filter(user => user.role === 'store_owner') || [];

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

  // Ensure stores is an array
  if (!Array.isArray(stores)) {
    return (
      <Container>
        <div>Error: Invalid stores data format</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Store Management</Title>
        <AddButton onClick={handleAddStore}>
          <FaStore />
          Add Store
        </AddButton>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search stores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Controls>

      <StoresGrid>
        {filteredStores?.length > 0 ? (
          filteredStores.map((store) => (
            <StoreCard key={store.id}>
              <StoreHeader>
                <StoreInfo>
                  <StoreName>{store.name}</StoreName>
                  <StoreAddress>{store.address}</StoreAddress>
                  <StoreOwner>
                    <FaUser />
                    {store.owner_name || 'No owner assigned'}
                  </StoreOwner>
                </StoreInfo>
                <StoreActions>
                  <ActionButton
                    variant="edit"
                    onClick={() => handleEditStore(store)}
                    title="Edit Store"
                  >
                    <FaEdit />
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleDeleteStore(store.id)}
                    title="Delete Store"
                  >
                    <FaTrash />
                  </ActionButton>
                </StoreActions>
              </StoreHeader>
              
              <StoreStats>
                <Stat>
                  <StatValue>{store.average_rating || '0.0'}</StatValue>
                  <StatLabel>Avg Rating</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{store.total_ratings || 0}</StatValue>
                  <StatLabel>Total Ratings</StatLabel>
                </Stat>
              </StoreStats>
            </StoreCard>
          ))
        ) : (
          <EmptyState>
            <p>No stores found.</p>
          </EmptyState>
        )}
      </StoresGrid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingStore ? 'Edit Store' : 'Add New Store'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Store name is required',
                    minLength: {
                      value: 2,
                      message: 'Store name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Store name must be less than 100 characters',
                    },
                  })}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter store name"
                />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  {...register('address', {
                    required: 'Address is required',
                    maxLength: {
                      value: 400,
                      message: 'Address must be less than 400 characters',
                    },
                  })}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter store address"
                />
                {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="owner_id">Store Owner</Label>
                <Select
                  id="owner_id"
                  {...register('owner_id', {
                    required: 'Store owner is required',
                  })}
                  className={errors.owner_id ? 'error' : ''}
                >
                  <option value="">Select Store Owner</option>
                  {storeOwners.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Select>
                {errors.owner_id && <ErrorMessage>{errors.owner_id.message}</ErrorMessage>}
              </FormGroup>

              <ButtonGroup>
                <SubmitButton
                  type="submit"
                  disabled={createStoreMutation.isLoading || updateStoreMutation.isLoading}
                >
                  {createStoreMutation.isLoading || updateStoreMutation.isLoading
                    ? 'Saving...'
                    : editingStore
                    ? 'Update Store'
                    : 'Create Store'}
                </SubmitButton>
                <CancelButton type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </CancelButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default StoreManagement; 