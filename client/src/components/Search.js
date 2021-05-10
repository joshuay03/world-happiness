import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import './styles/component_styles.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export default function Search() {
  const countriesURL = 'http://131.181.190.87:3000/countries';
  const URL = 'http://131.181.190.87:3000/rankings';
  const [country, setCountry] = useState([]);
  const [validCountry, setValidCountry] = useState(false);
  const [currentURL, setCurrentURL] = useState(URL);
  const [countriesList, setCountriesList] = useState([]);
  const columnData = [
    { headerName: 'Rank', field: 'rank', sortable: true, filter: true },
    { headerName: 'Country', field: 'country', sortable: true, filter: true },
    { headerName: 'Score', field: 'score', sortable: true, filter: true },
    { headerName: 'Year', field: 'year', sortable: true, filter: true },
  ];
  const [rowData, setRowData] = useState([]);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [alert, setAlert] = useState(null);
  const [year, setYear] = useState('All Years');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (countriesList.length === 0) {
      fetch(countriesURL)
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setError(true);
          } else {
            setCountriesList(res);
            countriesList.map(item => item.toLowerCase())
          }
        });
    }

    if (year !== 'All Years') {
      setCurrentURL(URL + '?year=' + year);
      if (validCountry) {
        setCurrentURL(currentURL + '?country=' + country[0].toLowerCase());
      }
    } else {
      setCurrentURL(URL);
      if (validCountry) {
        setCurrentURL(currentURL + '?country=' + country[0].toLowerCase());
      }
    }

    fetch(currentURL)
      .then(res => res.json())
      .then((res) => {
        if (res.error) {
          console.log(currentURL);
        } else {
          setRowData(res);
        }
      });
  }, [country, currentURL, validCountry, year, countriesList]);

  const handleSelect = (e) => {
    setYear(e);
  };

  const selectCountry = (e) => {
    e.preventDefault();
    if (countriesList.includes(country[0])) {
      setValidCountry(true);
    } else {
      setAlert('Please select a valid country');
      setValidCountry(false);
    }
  }

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const onPaginationChanged = (params) => {
    setCurrentPage(params.api.paginationGetCurrentPage());
  }

  if (!error) {
    return (
      <div className="w-full">
        <form onSubmit={selectCountry}>
          <div className="flex">
            <DropdownButton id="year-dropdown" title={year} onSelect={handleSelect}>
              <Dropdown.Item eventKey={'All Years'}>All Years</Dropdown.Item>
              <Dropdown.Item eventKey={'2015'}>2015</Dropdown.Item>
              <Dropdown.Item eventKey={'2016'}>2016</Dropdown.Item>
              <Dropdown.Item eventKey={'2017'}>2017</Dropdown.Item>
              <Dropdown.Item eventKey={'2018'}>2018</Dropdown.Item>
              <Dropdown.Item eventKey={'2019'}>2019</Dropdown.Item>
              <Dropdown.Item eventKey={'2020'}>2020</Dropdown.Item>
            </DropdownButton>
            <div className="w-6"></div>
            <Typeahead
              className="w-72"
              id="country-typeahead"
              labelKey="country"
              onChange={setCountry}
              options={countriesList}
              placeholder="Choose a country..."
              selected={country}
            />
            <div className="w-2"></div>
            <button className="bg-blue-100 h-button rounded px-3 text-base" type="submit">
              Search
            </button>
            <div className="w-right"></div>
            <label className="text-2xl text-red-600">{alert}</label>
          </div>
        </form>
        <div className="h-2"></div>
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
      </div>
    );
  } else {
      return (
        <Redirect to="/error" />
      );
  }
}
