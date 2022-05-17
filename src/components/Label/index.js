import React, { useState, useRef, useEffect } from "react";
import { Tag, Input, Popover, Button, Space, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GithubPicker } from "react-color";

import { useOutsideClick } from "../../utils/CustomHook";

function InputTag(props) {
  const [tags, setTags] = useState(props.item);
  const input = useRef(null);
  const [color, setColor] = useState("#EB2F96");
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const impactRef = useRef();

  // useOutsideClick(impactRef, () => setInputVisible(false));

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
    if (inputValue && tags.indexOf(inputValue) === -1) {
      updatedTags = [...tags, { text: inputValue, color: color.hex }];
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

  const content = (
    <div>
      <Space direction="vertical" size="small" style={{ display: "flex" }}>
        <Card size="small">
          <p style={{ color: color.hex }}>Color : {color.hex || "#fff"}</p>
          <GithubPicker value={color} onChange={setColor.bind(null)} />
          <br />
          <Button type="primary" danger onClick={handleInputConfirm}>
            Save
          </Button>
        </Card>
      </Space>
    </div>
  );

  return (
    <>
      <div style={{ marginBottom: 16 }}>{tagChild}</div>
      {inputVisible && (
        <>
          <Popover content={content} placement="bottom" arrowPointAtCenter>
            <Input
              ref={input}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={handleInputChange}
              // onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          </Popover>
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
