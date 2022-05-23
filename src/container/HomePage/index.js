import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input, Switch, Table as AntdActualTable } from "antd";
//under testing
import { Resizable } from "react-resizable";
import { Table } from "ant-table-extensions";
import { MoreOutlined } from "@ant-design/icons";

//components
import Annotator from "../../components/Annotator";
import InputTag from "../../components/Label";
import Popup from "../../components/Popup";
import Comments from "../../components/Comments";
import { getColumnSearchProps } from "../../components/SearchUtils";

//input json data
import { dataSet } from "../../assets/inputData";

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
      <th {...restProps} />
    </Resizable>
  );
};

function HomePage(props) {
  const data = useMemo(() => dataSet, [dataSet]);

  const [table, setTable] = useState(data.data);
  const [column, setColumns] = useState(data.columns);
  const [fixedTop, setFixedTop] = useState(false);
  const [selectedRowsArray, setSelectedRowsArray] = useState([]);

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
        with: 100,
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
          width: 80,
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
          width: 120,
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

      return list;
    });

    setColumns(updatedColumns);
    setTable(updatedCells);
  }, [data]);

  const handleResize =
    (index) =>
    (e, { size }) => {
      const newColumns = [...column];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
    };

  const mergeColumns = column.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  const formateFields = () => {
    console.log(selectedRowsArray, "selectedRowsArray");
    let eachRow = table[0];
    let calcfields = {};
    let keys = Object.keys(eachRow);
    Object.values(eachRow).forEach((e, i) => {
      if (typeof e == "object" || typeof e == "array") {
        console.log(typeof e, "typeof (e)");
        calcfields[keys[i]] = {
          header: keys[i],
          formatter: (_fieldValue, record, recordIndex) => {
            if (selectedRowsArray.indexOf(recordIndex) != -1) {
              return JSON.stringify(record[keys[i]]);
            } else {
              return null;
            }
          },
        };
      } else {
        calcfields[keys[i]] = {
          header: keys[i],
          formatter: (_fieldValue, record, recordIndex) => {
            if (selectedRowsArray.indexOf(recordIndex) != -1) {
              return record[keys[i]];
            } else {
              return null;
            }
          },
        };
      }
    });
    console.log(calcfields);
    // setFields(calcfields)
    return calcfields;
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRowsArray(selectedRowKeys);
    },
    getCheckboxProps: (id) => ({
      disabled: id.name === "Disabled User", // Column configuration not to be checked
      name: id.name,
    }),
  };
  const fields = formateFields();
  return (
    <>
      <div style={{ padding: "50px 100px" }}>
        <Table
          bordered
          components={{
            header: {
              cell: ResizableTitle,
            },
          }}
          exportableProps={{ fields, showColumnPicker: true }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          showSorterTooltip={false}
          summary={(pageData) => (
            <AntdActualTable.Summary fixed={fixedTop ? "top" : "bottom"} />
          )}
          sticky
          dataSource={table}
          columns={mergeColumns}
          pagination={{
            position: ["bottomRight"],
          }}
        />
      </div>
    </>
  );
}

export default HomePage;
