import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }

  &.active {
    color: #3498db;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2c3e50;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e9ecef;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 1rem 20px;
  color: #2c3e50;
  text-decoration: none;
  border-bottom: 1px solid #f8f9fa;

  &:hover {
    background-color: #f8f9fa;
  }

  &.active {
    background-color: #e3f2fd;
    color: #3498db;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/stores', label: 'Stores' },
          { to: '/stores', label: 'All Stores' },
        ];
      case 'store_owner':
        return [
          { to: '/store-owner/dashboard', label: 'Dashboard' },
          { to: '/stores', label: 'My Stores' },
          { to: '/ratings', label: 'My Store Ratings' },
        ];
      default:
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/stores', label: 'Stores' },
          { to: '/my-ratings', label: 'My Ratings' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Store Rating System</Logo>
        
        <NavLinks>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        {user ? (
          <UserMenu>
            <UserButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <FaUser />
              {user.name}
            </UserButton>
            
            <DropdownMenu isOpen={isDropdownOpen}>
              <DropdownItem to="/profile">
                <FaUser />
                Profile
              </DropdownItem>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </LogoutButton>
            </DropdownMenu>
          </UserMenu>
        ) : (
          <NavLinks>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </NavLinks>
        )}

        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </Nav>

      <MobileMenu isOpen={isMobileMenuOpen}>
        {user ? (
          <>
            {navLinks.map((link) => (
              <MobileNavLink
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </MobileNavLink>
            ))}
            <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              Profile
            </MobileNavLink>
            <button 
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem 20px',
                color: '#e74c3c',
                textDecoration: 'none',
                borderBottom: '1px solid #f8f9fa',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </MobileNavLink>
            <MobileNavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              Register
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header; 