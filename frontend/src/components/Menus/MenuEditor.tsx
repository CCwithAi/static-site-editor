import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: 'post' | 'page' | 'custom';
  order: number;
}

interface MenuEditorProps {
  menuId: string;
  menuName: string;
  onSave: () => void;
}

export const MenuEditor: React.FC<MenuEditorProps> = ({
  menuId,
  menuName,
  onSave
}) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [availablePosts, setAvailablePosts] = useState<Array<{id: string, title: string}>>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Fetch menu items and available posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, postsResponse] = await Promise.all([
          axios.get(`/api/menus/${menuId}/items`),
          axios.get('/api/posts')
        ]);
        setItems(menuResponse.data.items);
        setAvailablePosts(postsResponse.data.posts);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      }
    };
    fetchData();
  }, [menuId]);

  const handleAddItem = async () => {
    if (!selectedPost) return;

    try {
      const response = await axios.post(`/api/menus/${menuId}/items`, {
        postId: selectedPost
      });
      setItems([...items, response.data]);
      setSelectedPost('');
      setIsAddingItem(false);
      setIsDirty(true);
    } catch (error) {
      console.error('Failed to add menu item:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/menus/${menuId}/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
      setIsDirty(true);
    } catch (error) {
      console.error('Failed to remove menu item:', error);
    }
  };

  const handleReorderItems = async (startIndex: number, endIndex: number) => {
    const newItems = Array.from(items);
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(endIndex, 0, removed);

    setItems(newItems);
    setIsDirty(true);

    try {
      await axios.put(`/api/menus/${menuId}/order`, {
        items: newItems.map((item, index) => ({
          id: item.id,
          order: index
        }))
      });
    } catch (error) {
      console.error('Failed to reorder menu items:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/menus/${menuId}`, {
        items
      });
      setIsDirty(false);
      onSave();
    } catch (error) {
      console.error('Failed to save menu:', error);
    }
  };

  return (
    <div className="menu-editor">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium">Menu: {menuName}</h2>
          <p className="text-sm text-gray-500">{items.length} items</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-4 py-2 rounded ${
            isDirty
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          Save
        </button>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 mb-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center p-3 bg-white border rounded group"
          >
            <i className="fas fa-grip-vertical text-gray-400 mr-3 cursor-move"></i>
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-500">{item.type}</div>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Add Item */}
      {isAddingItem ? (
        <div className="p-4 bg-white border rounded">
          <h3 className="text-lg font-medium mb-3">Select a post to add:</h3>
          <select
            value={selectedPost}
            onChange={(e) => setSelectedPost(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">-- None --</option>
            <option value="home">Home</option>
            <option value="blog">Blog</option>
            {availablePosts.map(post => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              disabled={!selectedPost}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingItem(true)}
          className="w-full p-3 text-center border-2 border-dashed rounded hover:border-gray-400 text-gray-500 hover:text-gray-700"
        >
          + Add Item
        </button>
      )}
    </div>
  );
};
