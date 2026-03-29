import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ children, className = '' }) => (
  <div className={`bg-white/90 rounded-xl shadow p-4 mb-8 mt-0 text-center ${className}`} style={{backdropFilter: 'blur(2px)'}}>
    <h2 className="text-3xl font-bold">{children}</h2>
  </div>
);

export default PageTitle;
