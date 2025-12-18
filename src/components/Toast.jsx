import React from 'react';

const Toast = ({ message, visible }) => {
  if (!message) return null;
  return (
    <div className={`fixed top-4 right-4 z-[1000] transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-4 py-2 rounded-lg shadow-lg bg-gray-900 text-white text-sm font-semibold">
        {message}
      </div>
    </div>
  );
};

export default Toast;
