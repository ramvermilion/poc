import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Select, Space } from "antd";
import Highlighter from "react-highlight-words";

//under testing
import { Table } from "ant-table-extensions";
import { Resizable } from "react-resizable";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";

//components
import Annotator from "../../components/Annotator";
import InputTag from "../../components/Label";
import Popup from "../../components/Popup";
import Comments from "../../components/Comments";
// import { getColumnSearchProps } from "../../components/SearchUtils";

import { useDebounce } from "../../utils/CustomHook";

//input json data
import { dataSet } from "../../assets/inputData";

function HomePage(props) {
  const [table, setTable] = useState(dataSet.data);
  const [column, setColumns] = useState(dataSet.columns);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { Option } = Select;

  //TODO: optimize the search function and try moving to different file
  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(
            () =>
              searchInput && searchInput.current && searchInput.current.select()
          );
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
  }

  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
  }

  useEffect(() => {
    //table cell data
    const updatedCells = table.map((item, index) => {
      return {
        key: index,
        id: item.id,
        date: item.date,
        description: item.description,
        annotation: item.annotation,
        labels: item.labels,
        comments: item.comments,
        action: item.actions,
      };
    });

    //table columns data
    const updatedColumns = column.map((item, index) => {
      const sortList = ["id", "date"];
      const searchList = ["id", "description"];
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

      //NOTE:Place this before description annotation
      if (searchList.includes(id)) {
        list = {
          ...list,
          ...getColumnSearchProps(id),
        };
      }

      if (id === "description") {
        list = {
          ...list,
          width: 250,
          render: (text, record) => {
            return (
              <Annotator
                key={record.id}
                text={record.description}
                annotation={record.annotation}
                label={record.labels}
              />
            );
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
          width: 50,
          render: (comments, record, i) => (
            <>
              <Comments
                item={comments}
                record={record}
                i={i}
                setTable={(v) => setTable(v)}
                completeData={table}
              />
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

  return (
    <>
      <div style={{ padding: "50px 140px" }}>
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

export default HomePage;
