import React, { useState, useRef, useEffect } from "react";
import { Tag, Input, Popover, Button, Space, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Popup from "../Popup";
import Palette from "../Palette";

import { useOutsideClick } from "../../utils/CustomHook";

function InputTag(props) {
  const [tags, setTags] = useState(props.item);
  const input = useRef(null);
  const [color, setColor] = useState({ hex: "#84D2FF" });
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const popupRef = useRef();
  const labelRef = useRef(null);

  useOutsideClick(popupRef, () => setVisible(false));

  const handleClose = (removedTag) => {
    const updatedTags = tags.filter((tag) => tag !== removedTag);
    setTags(updatedTags);
  };

  const handleVisibleChange = (value) => {
    setVisible(true);
  };

  const handleClick = () => {
    // const { inputValue } = this.state;
    // let { tags } = this.state;
    let updatedTags = tags;
    if (inputText && tags.indexOf(inputText) === -1) {
      updatedTags = [...tags, { text: inputText, color: color.hex }];
    }
    setTags(updatedTags);
    setVisible(false);
    setInputText("");
  };

  const handleTextChange = (e) => {
    setInputText(e.currentTarget.value);
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

  const contentItems = (
    <div ref={popupRef} component="label">
      <Palette
        color={color}
        onTextChange={handleTextChange}
        labelValue={inputText}
        onChange={setColor.bind(null)}
        onClick={handleClick}
      />
    </div>
  );

  return (
    <>
      <div style={{ marginBottom: 16 }}>{tagChild}</div>
      <>
        <Popup
          placement="bottom"
          type="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
          content={contentItems}
        >
          <PlusOutlined style={{ color: "black" }} />
        </Popup>
      </>
    </>
  );
}

export default InputTag;
