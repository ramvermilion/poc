import React, { useRef } from "react";
import { Tag, Input, Popover, Button, Space, Card, Tabs, Divider } from "antd";
import { GithubPicker } from "react-color";
import Item from "antd/lib/list/Item";

function Palette(props) {
  const { color, onChange, onClick, label, ref, section } = props;
  const inputRef = useRef(null);
  const { TabPane } = Tabs;

  const callback = (v) => {
    console.log(v);
  };

  return (
    <div component="palette">
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Label" key="1">
          <Space direction="vertical" size="small" style={{ display: "flex" }}>
            {label && (
              <>
                <Input placeholder="Find a tag" />

                <Card size="small">
                  <ol style={{ width: "100%", listStyleType: "none" }}>
                    {label &&
                      label.map((item, index) => {
                        return (
                          <li
                            style={{
                              background: item.color,
                              margin: "5px 0",
                              color: "#fff",
                              fontSize: "15px",
                              textAlign: "center",
                            }}
                          >
                            {item.text}
                          </li>
                        );
                      })}
                  </ol>
                </Card>

                <Divider plain>OR</Divider>
              </>
            )}

            {section !== "annotation" && (
              <Input
                placeholder="Create a new Label"
                onChange={props.onTextChange}
                value={props.labelValue}
                ref={props.labelRef}
              />
            )}

            <Card size="small">
              {color && (
                <p>
                  Color : <input type="color" value={color.hex} />
                </p>
              )}

              <GithubPicker value={color} onChange={onChange} />
              <br />
              <Button type="primary" danger onClick={onClick}>
                Save
              </Button>
            </Card>
          </Space>
        </TabPane>

        <TabPane tab="Comment" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Palette;
