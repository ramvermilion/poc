import React, { useState, useRef, useEffect } from "react";
import { Input, Switch, Table } from "antd";

//under testing
// import { Table } from "ant-table-extensions";
import { MoreOutlined } from "@ant-design/icons";

//components
import Annotator from "../../components/Annotator";
import InputTag from "../../components/Label";
import Popup from "../../components/Popup";
import Comments from "../../components/Comments";
import { getColumnSearchProps } from "../../components/SearchUtils";

//input json data
import { dataSet } from "../../assets/inputData";

function HomePage(props) {
  const [table, setTable] = useState(dataSet.data);
  const [column, setColumns] = useState(dataSet.columns);
  const [fixedTop, setFixedTop] = useState(false);

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
        with: "20%",
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
  }, [dataSet]);

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
      <div style={{ padding: "50px 100px" }}>
        <Table
          bordered
          exportableProps={{ showColumnPicker: true }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          showSorterTooltip={false}
          summary={(pageData) => (
            <Table.Summary fixed={fixedTop ? "top" : "bottom"} />
          )}
          sticky
          dataSource={table}
          columns={column}
          pagination={{
            position: ["bottomRight"],
          }}
        />
      </div>
    </>
  );
}

export default HomePage;
