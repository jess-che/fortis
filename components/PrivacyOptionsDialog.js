import React, { useState } from 'react';

const PrivacyOptionsDialog = ({ onClose, onSave }) => {
  const [selectedOption, setSelectedOption] = useState(null); // Initialize to null

  const handleOptionChange = (option) => {
    console.log("Option selected:", option);
    setSelectedOption(option);
  };
  

  const handleSave = () => {
    onSave(selectedOption);
    onClose();
  };

  return (
    <div className="flex items-end justify-center z-50">
      <div className="p-4 bg-[#121212] bg-opacity-20 rounded-lg shadow-md backdrop-blur-md border border-white border-opacity-40">
        <h2 className="text-lg font-semibold mb-2">Select Privacy Option:</h2>
        <div className="space-y-2 flex flex-col">
          <label>
            <input
              type="radio"
              value="-1"
              checked={selectedOption === '-1'}
              onChange={() => handleOptionChange('-1')}
            />
            Private
          </label>
          <label>
            <input
              type="radio"
              value="-2"
              checked={selectedOption === '-2'}
              onChange={() => handleOptionChange('-2')}
            />
            Visible to Friends Only
          </label>
          <label>
            <input
              type="radio"
              value="1"
              checked={selectedOption === '1'}
              onChange={() => handleOptionChange('1')}
            />
            Public
          </label>
        </div>
        <div className="flex justify-end mt-1">
          <button
            className="px-4 py-2 text-white bg-[#2FABDD] rounded opacity-90 hover:opacity-80"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 ml-2 text-white hover:text-opacity-90"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyOptionsDialog;
