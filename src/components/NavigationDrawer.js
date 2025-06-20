'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import styles from './NavigationDrawer.module.css';
import TopLoadingBar from './TopLoadingBar';

const NavigationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log(user);
  const handleLogout = () => {
    logout();
    router.push('/SignIn');
  };

  const isActive = (path) => pathname === path;
  const isActiveGroup = (paths) => paths.some(path => pathname === path);

  return (
    <>
      <TopLoadingBar />
      <nav className={styles.navbar}>        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo official.png"
              alt="voltVillage Logo"
              width={110}
              height={20}
              priority
            />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className={styles.menuButton} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
              <i className="fas fa-home"></i> Home
            </Link>

            {/* Listings Dropdown */}
            <div className={styles.dropdownContainer}>
              <div className={`${styles.dropdownButton} ${isActiveGroup(['/listings', '/manage-listings']) ? styles.active : ''}`}>
                <i className="fas fa-tags"></i> Listings <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem', marginLeft: '2px' }}></i>
              </div>
              <div className={styles.dropdownContent}>
                <Link href="/listings" className={`${styles.navLink} ${isActive('/listings') ? styles.active : ''}`}>
                  <i className="fas fa-search"></i> Browse Listings
                </Link>
                {user && (
                  <Link href="/manage-listings" className={`${styles.navLink} ${isActive('/manage-listings') ? styles.active : ''}`}>
                    <i className="fas fa-cogs"></i> Manage Listings
                  </Link>
                )}
              </div>
            </div>

            {user && (
              <>
                {/* Dashboard for Superusers */}
                {user.is_superuser && (
                  <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}>
                    <i className="fas fa-chart-line"></i> Dashboard
                  </Link>
                )}

                {/* Communication Dropdown */}
                <div className={styles.dropdownContainer}>
                  <div className={`${styles.dropdownButton} ${isActiveGroup(['/messages', '/requests']) ? styles.active : ''}`}>
                    <i className="fas fa-comments"></i> Communication <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem', marginLeft: '2px' }}></i>
                  </div>
                  <div className={styles.dropdownContent}>
                    <Link href="/messages" className={`${styles.navLink} ${isActive('/messages') ? styles.active : ''}`}>
                      <i className="fas fa-envelope"></i> Messages
                    </Link>
                    <Link href="/requests" className={`${styles.navLink} ${isActive('/requests') ? styles.active : ''}`}>
                      <i className="fas fa-bullhorn"></i> Requests
                    </Link>
                  </div>
                </div>

                <Link href="/cart" className={`${styles.navLink} ${isActive('/cart') ? styles.active : ''}`}>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Link>

                {/* Account Dropdown */}
                <div className={styles.dropdownContainer}>
                  <div className={`${styles.dropdownButton} ${isActive('/profile') ? styles.active : ''}`}>
                    <i className="fas fa-user-circle"></i> Account <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem', marginLeft: '2px' }}></i>
                  </div>
                  <div className={styles.dropdownContent}>
                    <Link href="/profile" className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}>
                      <i className="fas fa-user"></i> Profile
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>      </nav>      {/* Mobile Navigation */}
      
      <div className={`${styles.mobileNav} ${isOpen ? styles.open : ''}`}>
        <div className={styles.mobileHeader}>
          <Image
            src="/logo official.png"
            alt="voltVillage Logo"
            width={100}
            height={18}
            priority
          />
          <button 
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.mobileLinks}>
          <Link 
            href="/" 
            className={`${styles.mobileLink} ${isActive('/') ? styles.active : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-home"></i> Home
          </Link>

          <Link 
            href="/listings" 
            className={`${styles.mobileLink} ${isActive('/listings') ? styles.active : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-search"></i> Browse Listings
          </Link>

          {user && (
            <>
              {/* Dashboard for Superusers */}
              {user.is_superuser && (
                <Link 
                  href="/dashboard" 
                  className={`${styles.mobileLink} ${isActive('/dashboard') ? styles.active : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-chart-line"></i> Dashboard
                </Link>
              )}

              <Link 
                href="/manage-listings" 
                className={`${styles.mobileLink} ${isActive('/manage-listings') ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-cogs"></i> Manage Listings
              </Link>

              <Link 
                href="/messages" 
                className={`${styles.mobileLink} ${isActive('/messages') ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-envelope"></i> Messages
              </Link>

              <Link 
                href="/requests" 
                className={`${styles.mobileLink} ${isActive('/requests') ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-bullhorn"></i> Requests
              </Link>

              <Link 
                href="/cart" 
                className={`${styles.mobileLink} ${isActive('/cart') ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-shopping-cart"></i> Cart
              </Link>

              <Link 
                href="/profile" 
                className={`${styles.mobileLink} ${isActive('/profile') ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-user"></i> Profile
              </Link>

              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }} 
                className={styles.mobileLogoutButton}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          )}
        </div> 
      </div>
    </>
  );
};

export default NavigationDrawer;