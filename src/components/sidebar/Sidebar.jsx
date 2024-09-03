import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './Sidebar.css';
import closeIcon from '../../assets/closeicon.png'; 
import openIcon from '../../assets/openicon.svg';  
import Searchbar from '../Searchbar/Searchbar';
import List from '../list/List';

const Sidebar = ({ onNewChat, onToggleSidebar }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const checkScreenSize = () => {
      setSidebarVisible(window.innerWidth > 768);
    };

    checkScreenSize(); // Set initial state
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    controls.start({
      width: isSidebarVisible ? 250 : 0,
      opacity: isSidebarVisible ? 1 : 0,
      transition: { duration: 0.3 }
    });

    if (typeof onToggleSidebar === 'function') {
      onToggleSidebar(isSidebarVisible);
    }
  }, [isSidebarVisible, controls, onToggleSidebar]);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleNewChat = () => {
    if (typeof onNewChat === 'function') {
      onNewChat(); 
    }
  };

  return (
    <>
      <motion.div className="sidebar" animate={controls}>
        <div className="profile-section">
          <motion.button
            className="close-button"
            onClick={toggleSidebar}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={closeIcon} alt="Close" className="toggle-icon" />
          </motion.button>
        </div>
        <motion.div
          className="searchbar-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Searchbar />
        </motion.div>
        <motion.div
          className='list-container'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <List />
        </motion.div>
        <div className="actions">
          <motion.button
            className="action-button"
            initial={{ opacity: 0, y: 20 }}
            onClick={handleNewChat}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Clear chat
          </motion.button>
        </div>
      </motion.div>
      {!isSidebarVisible && (
        <motion.button
          className="open-button"
          onClick={toggleSidebar}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src={openIcon} alt="Open" className="toggle-icon" />
        </motion.button>
      )}
    </>
  );
};

export default Sidebar;
