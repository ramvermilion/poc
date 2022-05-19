import React, { useState, useRef, useEffect } from "react";
import { TokenAnnotator, TextAnnotator } from "react-text-annotate";

import Popup from "../Popup";
import Palette from "../Palette";

import { useOutsideClick } from "../../utils/CustomHook";

function Annotator(props) {
  const { label,annotation ,text} = props;
  const [state, setState] = useState(annotation || []);
  const [content, setContent] = useState(text || "");
  const [color, setColor] = useState({ hex: "#84D2FF" });
  const [visible, setVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState({});

  const popupRef = useRef(null);

  useOutsideClick(popupRef, () => setVisible(false));

  const handleChange = (value) => {
    setState(value);
  };

  const handleVisibleChange = (value, e) => {
    setVisible(true);
  };

  document.addEventListener("contextmenu", (e) => {
    if (!e.target.attributes["data-start"]) return;
    const currentAttribute = {
      start: e.target.attributes["data-start"].value,
      end: e.target.attributes["data-end"].value,
    };
    const current = state.filter((item, index) => {
      return (
        currentAttribute.start == item.start && currentAttribute.end == item.end
      );
    });
    setCurrentSelection(current);
    e.preventDefault();
  });

  useEffect(() => {
    if (!visible) {
      const items = { ...currentSelection[0], color: color.hex };
      const result = state.map((value) =>
        value.start !== items.start ? value : items
      );
      setState(result);
    }
  }, [!visible]);

  const handleClick = (e) => {
    setColor(color);
    setVisible(false);
  };

  const contentItems = (
    <div ref={popupRef} component="annotator">
      <Palette
        color={color}
        label={label}
        onChange={setColor.bind(null)}
        onClick={handleClick}
      />
    </div>
  );

  return (
    <div>
      <Popup
        placement="bottom"
        type="contextMenu"
        visible={visible}
        onVisibleChange={handleVisibleChange}
        content={contentItems}
      >
        <TokenAnnotator
          style={{
            maxWidth: 500,
            lineHeight: 1.5,
          }}
          tokens={content.split(" ")}
          value={state}
          onChange={handleChange}
          getSpan={(span) => ({
            ...span,
            // tag: this.state.tag,
            color: color.hex,
          })}
        />
      </Popup>
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </div>
  );
}

export default Annotator;
