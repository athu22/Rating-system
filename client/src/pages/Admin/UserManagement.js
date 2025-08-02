import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import styled from 'styled-components';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
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

const FilterSelect = styled.select`
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

const UsersGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const UserCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const UserEmail = styled.p`
  color: #7f8c8d;
  margin: 0 0 0.5rem 0;
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

const UserActions = styled.div`
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

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const { data: users, isLoading, error } = useQuery(
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

  const createUserMutation = useMutation(
    async (data) => {
      const response = await api.post('/users', data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('User created successfully!');
        setShowModal(false);
        reset();
        queryClient.invalidateQueries('users');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create user';
        toast.error(message);
      },
    }
  );

  const updateUserMutation = useMutation(
    async ({ id, data }) => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('User updated successfully!');
        setShowModal(false);
        setEditingUser(null);
        reset();
        queryClient.invalidateQueries('users');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update user';
        toast.error(message);
      },
    }
  );

  const deleteUserMutation = useMutation(
    async (id) => {
      await api.delete(`/users/${id}`);
    },
    {
      onSuccess: () => {
        toast.success('User deleted successfully!');
        queryClient.invalidateQueries('users');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete user';
        toast.error(message);
      },
    }
  );

  const handleAddUser = () => {
    setEditingUser(null);
    reset();
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('role', user.role);
    setShowModal(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data });
    } else {
      createUserMutation.mutate(data);
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <div>Error loading users: {error.message}</div>
      </Container>
    );
  }

  // Ensure users is an array
  if (!Array.isArray(users)) {
    return (
      <Container>
        <div>Error: Invalid users data format</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <AddButton onClick={handleAddUser}>
          <FaUserPlus />
          Add User
        </AddButton>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
          <option value="admin">Admin</option>
        </FilterSelect>
      </Controls>

      <UsersGrid>
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id}>
              <UserAvatar>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </UserAvatar>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
                <UserRole role={user.role}>{user.role.replace('_', ' ')}</UserRole>
              </UserInfo>
              <UserActions>
                <ActionButton
                  variant="edit"
                  onClick={() => handleEditUser(user)}
                  title="Edit User"
                >
                  <FaEdit />
                </ActionButton>
                <ActionButton
                  onClick={() => handleDeleteUser(user.id)}
                  title="Delete User"
                >
                  <FaTrash />
                </ActionButton>
              </UserActions>
            </UserCard>
          ))
        ) : (
          <EmptyState>
            <p>No users found.</p>
          </EmptyState>
        )}
      </UsersGrid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingUser ? 'Edit User' : 'Add New User'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>

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
                  placeholder="Enter full name"
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
                  placeholder="Enter email address"
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              </FormGroup>

              {!editingUser && (
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      maxLength: {
                        value: 16,
                        message: 'Password must be less than 16 characters',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                        message: 'Password must contain at least one uppercase letter and one special character',
                      },
                    })}
                    className={errors.password ? 'error' : ''}
                    placeholder="Enter password"
                  />
                  {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </FormGroup>
              )}

              <FormGroup>
                <Label htmlFor="role">Role</Label>
                <Select
                  id="role"
                  {...register('role', {
                    required: 'Role is required',
                  })}
                  className={errors.role ? 'error' : ''}
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </Select>
                {errors.role && <ErrorMessage>{errors.role.message}</ErrorMessage>}
              </FormGroup>

              <ButtonGroup>
                <SubmitButton
                  type="submit"
                  disabled={createUserMutation.isLoading || updateUserMutation.isLoading}
                >
                  {createUserMutation.isLoading || updateUserMutation.isLoading
                    ? 'Saving...'
                    : editingUser
                    ? 'Update User'
                    : 'Create User'}
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

export default UserManagement; 