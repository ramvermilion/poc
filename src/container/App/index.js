import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Tag,
  Radio,
  Button,
  Select,
  Space,
} from "antd";

//under testing
import { Table } from "ant-table-extensions";
import { Resizable } from "react-resizable";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";

//components
import Annotator from "../../components/Annotator";
import InputTag from "../../components/Label";
import Popup from "../../components/Popup";

import { useDebounce } from "../../utils/CustomHook";
import Comments from "../../components/Comments"

//input json data
import { dataSet } from "../../assets/inputData";

function App(props) {
  const [table, setTable] = useState(dataSet.data);
  const [column, setColumns] = useState(dataSet.columns);
  const [selectionType, setSelectionType] = useState("checkbox");
  const searchInput = useRef(null);
  const { Option } = Select;

  useEffect(() => {
    //table cell data
    const updatedCells = table.map((item, index) => {
      return {
        key: index,
        id: item.id,
        date: item.date,
        description: item.description,
        labels: item.labels,
        comments: item.comments,
        action: item.actions,
      };
    });

    //table columns data
    const updatedColumns = column.map((item, index) => {
      const sortList = ["id", "date"];
      const id = item.id;

      let list = {
        title: item.name,
        dataIndex: item.id,
        with: 200,
      };

      if (sortList.includes(id)) {
        //TODO: Improvise sort function
        list.sorter = (a, b) => {
          if (id === "date") {
            return new Date(b[id]) - new Date(a[id]);
          } else {
            return a[id] - b[id];
          }
        };
      }

      if (id === "description") {
        list = {
          ...list,
          width: 250,
          render: (text, record) => {
            return <Annotator key={record.id} content={text} />;
          },
        };
      }

      if (id === "action") {
        list = {
          ...list,
          width: 50,
          render: (text) => {
            const content = (
              <div>
                <p>View Details</p>
                <p>View Similar Entries</p>
              </div>
            );

            return (
              <Popup placement="bottom" type="click" content={content}>
                <MoreOutlined
                  style={{ cursor: "pointer", fontSize: "20px", color: "#08c" }}
                />
              </Popup>
            );
          },
        };
      }

      if (id === "labels") {
        list = {
          ...list,
          width: 200,
          render: (tags) => (
            <>
              <InputTag item={tags} />
            </>
          ),
        };
      }
      if (id === "comments") {
        list = {
          ...list,
          width: 200,
          render: (comments,record,i) => (
            <>
              <Comments item={comments} record={record} i={i} setTable={(v)=>setTable(v)} completeData={table}/>
            </>
          ),
        };
      }
      // list = {
      //   ...list,
      //   onHeaderCell: (column) => ({
      //     width: column.width,
      //     onResize: handleResize(index),
      //   })
      // }

      return list;
    });

    setColumns(updatedColumns);
    setTable(updatedCells);
  }, [dataSet]);

  const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
      return <th {...restProps} />;
    }

    return (
      <Resizable
        width={width}
        height={0}
        handle={
          <span
            className="react-resizable-handle"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        }
        onResize={onResize}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        <th width-id={width} {...restProps} />
      </Resizable>
    );
  };

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const handleResize =
    (index) =>
    (e, { size }) => {
      const nextColumns = [...column];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      setColumns(nextColumns);
    };

  const columnsData = column.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (id) => ({
      disabled: id.name === "Disabled User", // Column configuration not to be checked
      name: id.name,
    }),
  };

  //TODO: optimize the search function and sync with debounce hook
  const handleSearch = (e) => {
    const input = searchInput.current.input.value.toUpperCase();
    if (input.length > 3) {
      const value = table.filter((item, index) => {
        return item.description.text.toUpperCase().includes(input);
      });
      setTable(value);
    } else {
      setTable(dataSet.data);
    }
  };

  return (
    <>
      <div style={{ padding: "50px 140px" }}>
        <Input.Group>
          <Input.Search
            ref={searchInput}
            onChange={handleSearch}
            size="large"
            placeholder="Entry description search"
            style={{ width: "40%", margin: "20px 0" }}
          />
          <Button
            danger
            onClick={() => setTable(dataSet.data)}
            style={{ margin: "25px" }}
          >
            Clear
          </Button>
        </Input.Group>

        <Table
          bordered
          exportableProps={{ showColumnPicker: true }}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          components={components}
          dataSource={table}
          columns={columnsData}
          pagination={{
            position: ["bottomRight"],
          }}
        />
      </div>
    </>
  );
}

export default App;
