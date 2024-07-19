import React, { useState } from 'react';

const ToggleSwitch = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState('option1');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          value="option1"
          checked={selectedOption === 'option1'}
          onChange={handleChange}
        />
        Option 1
      </label>
      <label>
        <input
          type="radio"
          value="option2"
          checked={selectedOption === 'option2'}
          onChange={handleChange}
        />
        Option 2
      </label>
    </div>
  );
};

const App = () => {
  const handleToggleChange = (value) => {
    console.log('Selected Option:', value);
  };

  return (
    <div>
      <h1>Radio Toggle Example</h1>
      <ToggleSwitch onChange={handleToggleChange} />
    </div>
  );
};

export default App;
