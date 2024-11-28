import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItem {
  id: string;
  name: string;
  type: 'header' | 'footer' | 'sidebar' | 'custom';
  itemCount: number;
}

interface MenuListProps {
  menus: MenuItem[];
  onCreateNew: () => void;
  onToggleSelect: () => void;
}

export const MenuList: React.FC<MenuListProps> = ({
  menus,
  onCreateNew,
  onToggleSelect
}) => {
  return (
    <div className="menu-list">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Menus</h1>
          <p className="text-sm text-gray-500">{menus.length} items</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onToggleSelect}
            className="px-4 py-2 text-gray-700 bg-white border rounded hover:bg-gray-50"
          >
            Toggle Select
          </button>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            + Create New
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-2">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            to={`/menus/${menu.id}`}
            className="block p-4 bg-white border rounded hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-medium">{menu.name}</h3>
                <p className="text-sm text-gray-500">
                  {menu.type} menu • {menu.itemCount} items
                </p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
