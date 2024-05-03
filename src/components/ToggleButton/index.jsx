import PropTypes from 'prop-types';
import React, { useState } from 'react';
import style from './toggleButton.module.scss';

const ToggleButton = ({ items, onSelect }) => {
  const [selectedItem, setSelectedItem] = useState(items[0].value);

  const handleItemClick = (value) => {
    setSelectedItem(value);

    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className={style.toggleButton}>
      <div className={style.buttonGroup}>
        {items.map((item) => (
          <button
            key={item.value}
            data-testid={`${item.value}-btn`}
            className={
              selectedItem === item.value
                ? style.toggleButtonItemActive
                : style.toggleButtonItem
            }
            onClick={() => handleItemClick(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

ToggleButton.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func,
};

export default ToggleButton;
