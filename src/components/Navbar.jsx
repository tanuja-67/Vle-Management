import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Village Identification', href: '/village-identification', icon: '📍' },
    { name: 'VLE Management', href: '/vle-management', icon: '👥' },
    { name: 'Analytics', href: '/agri-recommendation', icon: '📊' },
    { name: 'Machine Outsources', href: '/machine-outsources', icon: '⚙️' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav style={{ 
      background: 'white', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
      borderBottom: '1px solid #e5e7eb',
      width: '100%'
    }}>
      <div style={{ 
        width: '100%', 
        margin: '0', 
        padding: '0 2rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          height: '4rem', 
          alignItems: 'center' 
        }}>
          {/* Logo and Brand */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ 
                height: '2rem', 
                width: '2rem', 
                background: '#059669', 
                borderRadius: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <span style={{ color: 'white', fontSize: '1rem' }}>📍</span>
              </div>
              <div style={{ marginLeft: '0.75rem' }}>
                <h1 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#111827',
                  margin: 0 
                }}>
                  Rural<span style={{ color: '#059669' }}>Connect</span>
                </h1>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  margin: 0 
                }}>Reaching Roots Foundation</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: '2rem' 
          }} className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: isActive(item.href) ? '#059669' : '#374151',
                  backgroundColor: isActive(item.href) ? '#f0fdf4' : 'transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.href)) {
                    e.target.style.color = '#059669';
                    e.target.style.backgroundColor = '#f0fdf4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.href)) {
                    e.target.style.color = '#374151';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: '0.5rem', fontSize: '1rem' }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div style={{ 
            display: 'none', 
            alignItems: 'center' 
          }} className="desktop-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#111827',
                  margin: 0 
                }}>Field Worker</p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  margin: 0 
                }}>Bhopal, MP</p>
              </div>
              <div style={{ 
                height: '2rem', 
                width: '2rem', 
                background: '#d1d5db', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>FW</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div style={{ display: 'flex', alignItems: 'center' }} className="mobile-nav">
            <button
              onClick={toggleMenu}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                color: '#9ca3af',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <div style={{ 
            padding: '0.5rem', 
            paddingTop: '0.5rem', 
            paddingBottom: '0.75rem', 
            background: '#f9fafb', 
            borderTop: '1px solid #e5e7eb',
            width: '100%'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: isActive(item.href) ? '#059669' : '#374151',
                  backgroundColor: isActive(item.href) ? '#f0fdf4' : 'transparent',
                  marginBottom: '0.25rem',
                  transition: 'all 0.2s'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Profile */}
            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '1rem', 
              paddingBottom: '0.75rem' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem' }}>
                <div style={{ 
                  height: '2.5rem', 
                  width: '2.5rem', 
                  background: '#d1d5db', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>FW</span>
                </div>
                <div style={{ marginLeft: '0.75rem' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>Field Worker</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bhopal, MP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



