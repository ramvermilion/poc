import React, { useState, useRef, useEffect } from "react";
import { Popover, Button, Space, Card } from "antd";

function Popup(props) {
  return (
    <>
      <Popover
        content={props.content || ""}
        trigger={props.type}
        placement={props.placement}
      >
        {props.children}
      </Popover>
    </>
  );
}

export default Popup;
