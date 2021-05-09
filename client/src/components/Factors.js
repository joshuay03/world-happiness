import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import './styles/styles.scss';
import FactorsCharts from './FactorsCharts';

export default function Factors() {
  const URL = 'http://131.181.190.87:3000/factors/';
  const [currentURL, setCurrentURL] = useState(URL + '2020');
  const columnData = [
    { headerName: 'Rank', field: 'rank', sortable: true, filter: true },
    { headerName: 'Country', field: 'country', sortable: true, filter: true },
    { headerName: 'Score', field: 'score' },
    { headerName: 'Economy', field: 'economy', sortable: true, filter: true },
    { headerName: 'Family', field: 'family', sortable: true, filter: true },
    { headerName: 'Health', field: 'health', sortable: true, filter: true },
    { headerName: 'Freedom', field: 'freedom', sortable: true, filter: true },
    { headerName: 'Generosity', field: 'generosity', sortable: true, filter: true },
    { headerName: 'Trust', field: 'trust', sortable: true, filter: true },
  ];
  const [rowData, setRowData] = useState([]);
  const refresh = useRef(false);
  const [alert, setAlert] = useState('');
  const [token] = useState(localStorage.getItem('token'));
  const [loggedIn, setLoggedIn] = useState(token !== null);
  const [year, setYear] = useState('2020');
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const history = useHistory();
  

  useEffect(() => {
    if (loggedIn) {
      fetch(currentURL, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            switch (res.message) {
              case 'JWT token has expired':
                setAlert('Your session has expired. Please Please Log In again to view this page');
                setLoggedIn(false);
                localStorage.removeItem('token');
                break;
              default:
                history.push('/error');
            }
          } else {
            setRowData(res);
          }
        });
    } else {
      setAlert('Please Log In to view this page');
    }
  }, [token, loggedIn, currentURL, refresh, history]);

  const handleSelect = (e) => {
    setYear(e);
    setCurrentURL(URL + '/' + year);
    setAlert('You are looking at the factors for ' + year);
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const onPaginationChanged = (params) => {
      setCurrentPage(params.api.paginationGetCurrentPage());
  }

  if (loggedIn) {
    return (
      <div className="w-full">
        <div>
          <DropdownButton id="year-dropdown" title={year} onSelect={handleSelect}>
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
            paginationPageSize={pageSize}
            onPaginationChanged={onPaginationChanged}
          />
        </div>
        <div className="h-6"></div>
        <div>
          <FactorsCharts data={rowData} pageSize={pageSize} currentPage={currentPage} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid place-items-center mt-16">
        <label className="text-3xl text-gray-200">{alert}</label>
      </div>
    );
  }
}
