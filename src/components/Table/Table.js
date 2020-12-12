import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
//import styles from "./styles.module.scss";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
const TableComponent = () => {
  const { SearchBar } = Search;

   function size() {
     let size = [];
    for(let i= 10 ; i>=1; i--){
      console.log(i);
      size.push({
        text: i, value: i
      })
    }
  return size;
  }


  const options = {
    paginationSize: 2,
    sizePerPageList: size(),
  }

  const [columns, setColumns] = useState([
    {
      dataField: "title",
      text: "Tittle",
    },
    {
      dataField: "subtitle",
      text: "Subtitle",
      searchable: false,
    },
    {
      dataField: "isbn13",
      text: "Isbn13",
      searchable: false,
    },
    {
      dataField: "price",
      text: "Price",
      searchable: false,
    },
    {
      dataField: "url",
      text: "Url",
      searchable: false,
    },
  ]);

  const [dataBooks, setDataBooks] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3004")
      .then((res) => {
        let dataBooks = [];

        res.data.books.map((val, i) => {
          dataBooks.push({ id: i, ...val });
        });
        setDataBooks(dataBooks);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {};
  }, []);

  return (
    <div style={{fontSize: "14px", padding:"1em"}}>

      <input></input>

      {dataBooks && (
        <ToolkitProvider
          keyField="id"
          data={dataBooks}
          columns={columns}
    /*       search */
        >
          {(props) => (
            <div>
              {/* <SearchBar {...props.searchProps} /> */}
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory(options)}
              />
            </div>
          )}
        </ToolkitProvider>
      )}
    </div>
  );
};

TableComponent.propTypes = {};

export default TableComponent;
