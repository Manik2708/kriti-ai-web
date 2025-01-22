import React from 'react';

export default function AlertBox({ message, type }) {
  return (
    <div 
      className={`${
        type === 'success' 
          ? 'bg-green-100 text-green-600 border border-green-300' 
          : type === 'info' 
          ? 'bg-blue-100 text-blue-600 border border-blue-300' 
          : 'bg-red-0 text-red-600 border border-red-600'
      } p-4 rounded-full text-center font-inter font-semibold mb-4 opacity-100`}
    >
      {message}
    </div>
  );
}