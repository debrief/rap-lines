import React from 'react';
import HistorySection from './HistorySection';
import OutlineSection from './OutlineSection';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <HistorySection />
      <OutlineSection />
    </aside>
  );
}

export default Sidebar;
