import React from 'react';
import { 
  HomeIcon, 
  BugAntIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import './Sidebar.css';

const Sidebar = () => {
  const navigationItems = [
    { name: 'Dashboard', icon: HomeIcon, active: false },
    { name: 'Bugs', icon: BugAntIcon, active: true },
    { name: 'Reports', icon: ChartBarIcon, active: false },
    { name: 'Settings', icon: Cog6ToothIcon, active: false },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <BugAntIcon className="logo-icon" />
          <span className="logo-text">BugTracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <a 
                href="#" 
                className={`nav-item ${item.active ? 'nav-item-active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span className="nav-text">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <UserCircleIcon className="user-avatar" />
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-role">Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 