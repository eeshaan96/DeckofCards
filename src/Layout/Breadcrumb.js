import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css'; // Import CSS for styling

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb">
      <ul>
        {items.map((item, index) => (
          <li key={index} className={index === items.length - 1 ? 'active' : ''}>
            {index !== items.length - 1 ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && ' > '}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
