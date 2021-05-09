import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import './styles/styles.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export default function Rankings() {
  const URL = 'http://131.181.190.87:3000/rankings';
  const [currentURL, setCurrentURL] = useState(URL);
  const [error, setError] = useState(false);
  const [year, setYear] = useState('All Years');
  const columnData = [
    { headerName: 'Rank', field: 'rank', sortable: true, filter: true },
    { headerName: 'Country', field: 'country', sortable: true, filter: true },
    { headerName: 'Score', field: 'score', sortable: true, filter: true },
    { headerName: 'Year', field: 'year', sortable: true, filter: true },
  ];
  const [rowData, setRowData] = useState([]);

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const handleSelect = (e) => {
    setYear(e);
  };

  useEffect(() => {
    if (year !== 'All Years') {
      setCurrentURL(URL + '?year=' + year);
    } else {
      setCurrentURL(URL);
    }

    fetch(currentURL)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(true);
        } else {
          setRowData(res);
        }
      });
  }, [year, currentURL]);

  if (!error) {
    return (
        <div className="w-full">
          <div>
            <DropdownButton id="year-dropdown" title={year} onSelect={handleSelect}>
              <Dropdown.Item eventKey={'All Years'}>All Years</Dropdown.Item>
              <Dropdown.Item eventKey={'2015'}>2015</Dropdown.Item>
              <Dropdown.Item eventKey={'2016'}>2016</Dropdown.Item>
              <Dropdown.Item eventKey={'2017'}>2017</Dropdown.Item>
              <Dropdown.Item eventKey={'2018'}>2018</Dropdown.Item>
              <Dropdown.Item eventKey={'2019'}>2019</Dropdown.Item>
              <Dropdown.Item eventKey={'2020'}>2020</Dropdown.Item>
            </DropdownButton>
          </div>
          <div className="h-grid ag-theme-material">
            <AgGridReact
              onGridReady={onGridReady}
              columnDefs={columnData}
              rowData={rowData}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </div>
      );
  } else {
      return (
        <Redirect to="/error" />
      );
  }
}
