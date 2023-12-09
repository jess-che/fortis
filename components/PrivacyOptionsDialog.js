// privacy choice for saving template account -> logfinish
import React, { useState } from 'react';

const PrivacyOptionsDialog = ({ onClose, onSave }) => {
  // keeps track of which privacy mode they have selected
  const [selectedOption, setSelectedOption] = useState(null);  

  // function to handle changing choice
  const handleOptionChange = (option) => {
    console.log("Option selected:", option);
    setSelectedOption(option);
  };
  
  // function to handle final selection
  const handleSave = () => {
    onSave(selectedOption);
    onClose();
  };

  return (
    // privacy box make it pop up
    <div className="flex items-end justify-center z-50">
      {/* actual visible component */}
      <div className="p-4 bg-[#121212] bg-opacity-20 rounded-lg shadow-md backdrop-blur-md border border-white border-opacity-40">
        {/* dialog */}
        <h2 className="text-lg font-semibold mb-2">Select Privacy Option:</h2>

        {/* options */}
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

        {/* button to save or cancel */}
        <div className="flex justify-end mt-1">
          {/* save saves final selected choice */}
          <button
            className="px-4 py-2 text-white bg-[#2FABDD] rounded opacity-90 hover:opacity-80"
            onClick={handleSave}
          >
            Save
          </button>
          {/* cancel closes the dialog */}
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
