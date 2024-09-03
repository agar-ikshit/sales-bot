import React, { useEffect, useState } from 'react';
import printersData from '../printers.json'; 
import "./list.css";

const List = () => {
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    setPrinters(printersData);
  }, []);

  const handleItemClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div>
      <ul>
        {printers.map(printer => (
          <li key={printer.id} onClick={() => handleItemClick(printer.link)} className="printer-item">
            {printer.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
