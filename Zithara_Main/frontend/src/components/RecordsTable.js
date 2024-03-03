// frontend/src/components/RecordsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecordsTable.css'; // Import CSS file for styling

const RecordsTable = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('');
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/records?sortBy=${sortBy}`);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchData();
  }, [sortBy]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when searching
  };

  const filteredRecords = records.filter(record => {
    return (
      record.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = type => {
    if (type === 'date' || type === 'time') {
      setSortBy(type);
    }
  };

  return (
    <div className="records-table-container">
      <h2>Records Table</h2>
      <input
        type="text"
        placeholder="Search by name or location"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={() => handleSort('date')}>Sort by Date</button>
      <button onClick={() => handleSort('time')}>Sort by Time</button>
      <table className="records-table">
        {/* Table header */}
        <thead>
          <tr>
            <th>Sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {currentRecords.map(record => (
            <tr key={record.sno}>
              <td>{record.sno}</td>
              <td>{record.customer_name}</td>
              <td>{record.age}</td>
              <td>{record.phone}</td>
              <td>{record.location}</td>
              <td>{new Date(record.created_at).toLocaleDateString()}</td>
              <td>{new Date(record.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredRecords.length / recordsPerPage) }, (ele, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecordsTable;
