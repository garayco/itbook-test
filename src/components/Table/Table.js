import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import useDebounce from "../../Utils/useDebounce";
import { Table, Modal, Image, Tooltip, Row, Col, Button } from "antd";
import Drawer from "../Drawer/Drawer";
import { Input } from "antd";
import {
  SaveOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import exportExcel from "../../Utils/ExportExcel/ExportExcel";

const TableComponent = () => {
  const tableColumns = [
    {
      dataIndex: "title",
      title: "Tittle",
      key: "title",
      render: (text, record) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <a
            href="#"
            onClick={() => {
              setModalData(record);
              setShowModal(true);
            }}
          >
            {text}
          </a>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ["descend", "ascend"],
    },
    {
      dataIndex: "subtitle",
      title: "Subtitle",
      key: "subtitle",
      render: (text) => renderColumnText(text),
    },
    {
      dataIndex: "isbn13",
      title: "Isbn13",
      key: "isbn13",
      render: (text) => renderColumnText(text),
      width: 140,
    },
    {
      dataIndex: "price",
      title: "Price",
      key: "price",
      render: (text) => renderColumnText(text),
      ellipsis: true,
      width: 75,
    },
    {
      dataIndex: "url",
      title: "Url",
      key: "url",
      render: (text) => renderColumnText(text),
      ellipsis: true,
    },
  ];

  const { Search } = Input;
  const [columns, setColumns] = useState(null);
  const [searchBook, setSearchBook] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [dataBooks, setDataBooks] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchBook, 500);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [columCheck, setColumCheck] = useState(null);
  const [localStorageInfo, setLocalStorageInfo] = useState(
    localStorage.getItem("tableInfo")
  );

  //Initial useEffect
  useEffect(() => {
    const tableInfo = localStorageInfo;
    let tempcolumCheck = [];
    if (localStorageInfo) {
      for (let i = 0; i < tableColumns.length; i++) {
        for (let j = 0; j < JSON.parse(tableInfo).length; j++) {
          if (tableColumns[i].key === JSON.parse(tableInfo)[j].key) {
            tempcolumCheck[i] = true;
            break;
          } else {
            tempcolumCheck[i] = false;
          }
        }
      }

      setColumCheck(tempcolumCheck);
    } else {
      setColumCheck([true, true, true, true, true]);
      setColumns([...tableColumns]);
    }
  }, []);

  //Search update with debounce hook
  useEffect(() => {
    if (debouncedSearch) {
      setIsFetching(true);
      _onSearch(debouncedSearch, currentPage).then((res) => {
        setDataBooks(res);
        setDataSource(res.books);
        setIsFetching(false);
      });
    } else {
      setDataBooks([]);
    }
  }, [debouncedSearch, currentPage]);

  const _onSearch = (e, currentPage) => {
    return axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.itbook.store/1.0/search/${e}/${currentPage}`
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        return [];
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  useEffect(() => {
    if (columCheck) {
      let tempColumns = [];
      for (let i = 0; i < tableColumns.length; i++) {
        if (columCheck[i]) {
          tempColumns.push(tableColumns[i]);
        }
      }
      if (localStorageInfo) {
        let tableInfo = JSON.parse(localStorageInfo);
        tableInfo.map((val) => {
          if (val.key == "title") {
            val["render"] = (text, record) => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <a
                  href="#"
                  onClick={() => {
                    setModalData(record);
                    setShowModal(true);
                  }}
                >
                  {text}
                </a>
              </div>
            );
            val["sorter"] = (a, b) => a.title.localeCompare(b.title);
          } else {
            val["render"] = (text) => renderColumnText(text);
          }
        });
        setColumns(tableInfo);
        setLocalStorageInfo(false);
      } else {
        setColumns([...tempColumns]);
      }
    }
  }, [columCheck]);

  const setNewHeader = (checked, index) => {
    let tempcolumCheck = columCheck;
    tempcolumCheck[index] = checked;
    setColumCheck([...tempcolumCheck]);
  };

  const saveOnLocalStorage = () => {
    localStorage.setItem("tableInfo", JSON.stringify(columns));
    alert("Table state saved");
  };

  const renderColumnText = (text) => (
    <Tooltip title={text}>
      <div
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {text}
      </div>
    </Tooltip>
  );

  const _exportExcel = () => {
    let auxDataSource = [...dataSource];
    const arrayKeys = columns.map((val) => val.key);

    let arrayData = [];
    auxDataSource.map((val, i) => {
      arrayData[i] = {};
      arrayKeys.map((key) => {
        arrayData[i][key] = val[key];
      });
    });
    exportExcel(arrayData);
  };

  return (
    <>
      <Drawer
        headers={tableColumns}
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
        onChangeCheckBox={setNewHeader}
      />
      <Modal
        title={modalData?.title}
        visible={showModal}
        onOk={closeModal}
        cancelButtonProps={{ style: { display: "none" } }}
        centered
        onCancel={closeModal}
        bodyStyle={{ textAlign: "center" }}
      >
        <Image width={400} src={modalData?.image} />
      </Modal>

      <Row style={{ marginBottom: "1em" }}>
        <Col flex="auto">
          <Search
            value={searchBook}
            placeholder="input search book"
            onChange={(e) => {
              setSearchBook(e.target.value);
            }}
            onClick={(e) => {
              setSearchBook(e.target.value);
            }}
            enterButton
          />
        </Col>
        <Col>
          <Button
            onClick={saveOnLocalStorage}
            style={{ border: "none", color: "black", margin: "0 0.5em" }}
            icon={<SaveOutlined style={{ fontSize: "1.5em" }} />}
          />
          <Button
            onClick={_exportExcel}
            style={{ border: "none", color: "black", margin: "0 0.5em" }}
            icon={<DownloadOutlined style={{ fontSize: "1.5em" }} />}
            disabled={!dataSource || dataSource.length == 0}
          />
          <Button
            onClick={() => setShowDrawer(true)}
            style={{ border: "none", color: "black", margin: "0 0.5em" }}
            icon={<PlusCircleOutlined style={{ fontSize: "1.5em" }} />}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            rowKey="isbn13"
            columns={columns}
            dataSource={dataSource}
            loading={isFetching}
            locale={{ emptyText: "Search your book :)" }}
            pagination={{
              pageSizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              total: parseInt(dataBooks?.total),
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Col>
      </Row>
    </>
  );
};

TableComponent.propTypes = {};

export default TableComponent;
