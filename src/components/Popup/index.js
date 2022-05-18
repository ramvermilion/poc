import React, { useState, useRef, useEffect } from "react";
import { Popover, Button, Space, Card } from "antd";

function Popup(props) {
  return (
    <div component="popup">
      <Popover
        onVisibleChange={props.onVisibleChange}
        content={props.content || ""}
        trigger={props.type}
        placement={props.placement}
        visible={props.visible}
      >
        {props.children}
      </Popover>
    </div>
  );
}

export default Popup;
