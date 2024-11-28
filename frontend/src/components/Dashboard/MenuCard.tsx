import React from 'react';
import { Link } from 'react-router-dom';

export const MenuCard: React.FC = () => {
  return (
    <Link
      to="/menus"
      className="block p-6 bg-white border rounded-lg hover:border-gray-300 transition-colors"
    >
      <div className="flex flex-col items-center text-center">
        <i className="fas fa-bars text-2xl mb-4"></i>
        <h2 className="text-xl font-medium">Menus</h2>
        <p className="text-sm text-gray-500">Manage Menus</p>
      </div>
    </Link>
  );
};
