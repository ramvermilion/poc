import React, { useState, useRef, useEffect } from "react";
import { Tag, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GithubPicker } from 'react-color';
// var { EditableInput } = require('react-color/lib/components/common');


function InputTag(props) {
  const [tags, setTags] = useState(props.item);
  const input = useRef(null);
  const [color, setColor] = useState('#EB2F96');
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleClose = (removedTag) => {
    const updatedTags = tags.filter((tag) => tag !== removedTag);
    setTags(updatedTags);
  };

  const showInput = () => {
    // setInputVisible(true, () => this.input.focus());
    setInputVisible(true);
    // input.current.focus();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    // const { inputValue } = this.state;
    // let { tags } = this.state;
    let updatedTags = tags;
    debugger
    if (inputValue && tags.indexOf(inputValue) === -1) {
      updatedTags = [...tags,{text:inputValue,color:color.hex}];
    }
    setTags(updatedTags);
    setInputVisible(false);
    setInputValue("");
  };

  const forMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        color={tag.color}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag.text}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);

  return (
    <>
      <div style={{ marginBottom: 16 }}>{tagChild}</div>
      {inputVisible && (
        <>
        <Input
          ref={input}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
        <GithubPicker value={color} onChange={setColor.bind(null)}/>
        </>
      )}
      {!inputVisible && (
        <Tag onClick={showInput} className="site-tag-plus">
          <PlusOutlined /> New Label
        </Tag>
      )}
    </>
  );
}

export default InputTag;
