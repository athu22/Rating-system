import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaStore, FaStar, FaUsers, FaChartBar } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
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
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  position: relative;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  &.active {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  &:hover::after,
  &.active::after {
    width: 80%;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${fadeIn} 0.3s ease;
  margin-top: 0.5rem;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  &:first-child {
    border-radius: 16px 16px 0 0;
  }

  &:last-child {
    border-radius: 0 0 16px 16px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  border-radius: 0 0 16px 16px;

  &:hover {
    background: rgba(231, 76, 60, 0.1);
    color: #c0392b;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 20px;
  color: #2c3e50;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  &.active {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const RoleBadge = styled.span`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
    setIsMobileMenuOpen(false);
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
          { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
          { to: '/admin/stores', label: 'Stores', icon: <FaStore /> },
          { to: '/stores', label: 'All Stores', icon: <FaStore /> },
        ];
      case 'store_owner':
        return [
          { to: '/store-owner/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
          { to: '/stores', label: 'My Stores', icon: <FaStore /> },
          { to: '/ratings', label: 'My Store Ratings', icon: <FaStar /> },
        ];
      default:
        return [
          { to: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
          { to: '/stores', label: 'Stores', icon: <FaStore /> },
          { to: '/my-ratings', label: 'My Ratings', icon: <FaStar /> },
        ];
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'store_owner': return 'Store Owner';
      case 'user': return 'User';
      default: return role;
    }
  };

  const navLinks = getNavLinks();

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <FaStore />
          Store Rating System
        </Logo>
        
        <NavLinks>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        {user ? (
          <UserMenu>
            <UserButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <FaUser />
              {user.name}
              <RoleBadge>{getRoleDisplayName(user.role)}</RoleBadge>
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
                {link.icon}
                {link.label}
              </MobileNavLink>
            ))}
            <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <FaUser />
              Profile
            </MobileNavLink>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '1rem 20px',
                color: '#e74c3c',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <FaSignOutAlt />
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