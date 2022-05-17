import React, { useState } from 'react';
import { Layout, Table, Breadcrumb } from 'antd';
import { Resizable } from 'react-resizable';
import './index.css';
import 'antd/dist/antd.css';

import { dataSet } from './dataSet';


const data = [
    {
      date: '2018-02-11',
      amount: 120,
      type: 'income',
      note: '（Tezepelumab) 【What】There is an impression that the effect and clinical positioning are unknown. It is effective regardless of the number of bEOS, but I do not know the image of what kind of patient to actually use it. The effect might be expected for the asthma of the steroid resistance derived from ILC2. 【What】 As a JGL drafting committee member, I have heard that the details are unknown, but it seems that standards for use will be prepared from academic societies. （SYNAPSE) What: In many cases, asthma is associated with nasal symptoms, and the use of Bio preparations in such cases may improve nasal symptoms as well as asthma. 【What】 The proportion of asthma and AERD combinations in NP is consistent with the actual clinical practice. The effect of Mepolizumab by the severity of asthma may be verified in this study. 【Why】Because the incorporated cases are severe patients such as seeing in otolaryngology. Because the severity of asthma in patients with NP is different. SoWhat: If the severity-specific effects on both diseases become clear, treatment options will increase. (Other) What: Im interested in new data for each antibody preparation and information on new antibody preparations. 【Why】Anti-IL-4Rα formulations are applicable in addition to asthma, but we believe that knowing the development status of other Bio preparations will expand treatment options. 【SoWhat】We feel that the current indication of existing biologics alone is not enough, and we hope to further expand the indication',
    },
    {
      date: '2018-03-11',
      amount: 243,
      type: 'income',
      note: 'tranLorem Ipsum is simply dummy text of ',
    },
    {
      date: '2018-04-11',
      amount: 98,
      type: 'income',
      note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
  ];

  const data2 = [
    {
        title: 'Id',
        dataIndex: 'ID',
        width: 100,
      },
        {
            title: 'Name',
            dataIndex: 'VALUE',
            width: 100,
          },
          {
            title: 'Date',
            dataIndex: 'Date',
            width: 100,
          },
        {
          title: 'Product',
          dataIndex: 'Product',
          width: 100,
          sorter: (a, b) => a.amount - b.amount,
        },
        {
          title: 'Summary',
          dataIndex: 'Summary',
          width: 100,
        },
        {
          title: 'Text',
          dataIndex: 'Text',
          width: 400,
        },
        {
          title: 'Comments',
          dataIndex:'Comments',
        },
      ]

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
      <>
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
    </>
  );
};

function ResizableComponent(props) {
    const updatedColumns = dataSet.columns.map((item, index) => {
        const sortList = ["Id", "Date"];
        const searchList = ["Name","Product"];
    
        const title = item.name;
    
        let list = {
          title: item.name,
          dataIndex: item.name,
          width:100
        };
    
        // if (sortList.includes(title)) {
        //   //TODO: Improvise sort function
        //   list.sorter = (a, b) => {
        //     if (title === "Date") {
        //       return new Date(b[title]) - new Date(a[title]);
        //     } else {
        //       return a[title] - b[title];
        //     }
        //   };
        // }
    
        // if(searchList.includes(title)){
        //   list={
        //     ...list,
        //     ...getColumnSearchProps(title),
        //   }
        // }
    
        // if(title === 'Text'){
        //   list={
        //     ...list,
        //     width:400
        //   }
        // }
    
        // list = {
        //   ...list,
        //   onHeaderCell: (column) => ({
        //     width: column.width,
        //     onResize: handleResize(index),
        //   })
        // }
        return list;
      });

  const [table, setTable] = useState(dataSet.data);
  const [columns, setColumns] = useState(data2);

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const handleResize = (index) => (e, { size }) => {
    const nextColumns = [...columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };

    setColumns(nextColumns);
  };

  const columnsData = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <>
    <Table bordered components={components} columns={columnsData} dataSource={table} />
    </>
  );
}

export default ResizableComponent;
