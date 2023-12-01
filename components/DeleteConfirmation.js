// DeleteConfirmation.js

import React from 'react';

const DeleteConfirmation = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-[#121212] backdrop-blur-md bg-opacity-70 border-2 border-white border-opacity-30 p-6 rounded-lg shadow-lg">
        <p className="text-lg font-semibold mb-4">Are you sure you want to delete your account?</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#C32E67] text-white rounded hover:bg-opacity-80"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
