import React, { useState, useEffect } from "react";
import { Drawer, Checkbox } from "antd";
import PropTypes from "prop-types";

const DrawerComponent = ({ headers, show, onClose, onChangeCheckBox }) => {
  const [elements, setElements] = useState(null);
  useEffect(() => {
    const tableInfo = localStorage.getItem("tableInfo");
    let auxHeaders = [...headers];
    if (tableInfo) {
      for (let i = 0; i < auxHeaders.length; i++) {
        for (let j = 0; j < JSON.parse(tableInfo).length; j++) {
          if (auxHeaders[i].key === JSON.parse(tableInfo)[j].key) {
            auxHeaders[i]["checked"] = true;
            break;
          } else {
            auxHeaders[i]["checked"] = false;
          }
        }
      }
    } else {
      for (let i = 0; i < auxHeaders.length; i++) {
        auxHeaders[i]["checked"] = true;
      }
    }
    setElements(auxHeaders);
  }, []);

  return (
    <Drawer
      title="Table columns"
      placement="right"
      onClose={onClose}
      visible={show}
    >
      {elements?.map((val, i) => (
        <li key={val.title + i} style={{ listStyle: "none" }}>
          <Checkbox
            style={{ marginBottom: "5px" }}
            defaultChecked={val.checked}
            onChange={(e) => onChangeCheckBox(e.target.checked, i)}
          >
            {val.title}
          </Checkbox>
        </li>
      ))}
    </Drawer>
  );
};

DrawerComponent.propTypes = {
  headers: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
};

export default DrawerComponent;
