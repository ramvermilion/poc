import React, { useState } from "react";
import { Table } from "antd";
import { Resizable } from "react-resizable";
import { ResizeCallbackData } from "react-resizable";
import { ColumnsType, ColumnType } from "antd/lib/table";

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

const ResizableTable = () => {
  const [columns, setColumns] = useState([
    {
      title: "Id",
      dataIndex: "id",
      width: 50,
    },
    {
      title: "Entered On",
      dataIndex: "entered",
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 100,
    },
    {
      title: "Note",
      dataIndex: "note",
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: () => <a>Delete</a>,
    },
  ]);
  const data = [
    {
      key: 0,
      date: "2018-02-11",
      id: 12997771,
      entered: "28-Feb-2022",
      note: "Pharmacist called to enquireabout Belimumab expiration date. It stated as '03/2022' - She would like to know does that mean the last day of March?Her customer is concerned about Adverse Event.",
    },
    {
      key: 1,
      date: "2018-03-11",
      id: 12997772,
      entered: "31-Jan-2022",
      note: "Pharmacist called to enquireabout Belimumab expiration date. It stated as '03/2022' - She would like to know does that mean the last day of March?Her customer is concerned about Adverse Event.",
    },
    {
      key: 2,
      date: "2018-04-11",
      id: 12997773,
      entered: "31-May-2022",
      note: "Pharmacist called to enquireabout Belimumab expiration date. It stated as '03/2022' - She would like to know does that mean the last day of March?Her customer is concerned about Adverse Event.",
    },
  ];

  const handleResize =
    (index) =>
    (e, { size }) => {
      const newColumns = [...columns];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
    };

  const mergeColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <Table
      bordered
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
      columns={mergeColumns}
      dataSource={data}
    />
  );
};

export default ResizableTable;
