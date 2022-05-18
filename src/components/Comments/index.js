import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Tag, Radio, Comment, Tooltip, List, Space, Popover, Modal } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

function Comments(props) {
  const [commentText, updateCommentText] = useState("");
  const [datetime, setDateTime] = useState("")
  const onCommentChange = (event) => {
    event.preventDefault();
    updateCommentText(event.target.value);

  }
  const formateDatetime = (itemDatetime) => {

    let formatedDate = moment(itemDatetime).format("YYYY-MM-DD HH:mm:ss")
    let showDate = moment(itemDatetime).fromNow()
    return (<Tooltip title={formatedDate}><span>{showDate}</span></Tooltip>)

  }
  const enterCommentLine = (event, i, currentComments) => {
    if (event.charCode === 13) {
      submitCommentLine(event, i, currentComments)

    }
  }
  const submitCommentLine = (event, i, currentComments) => {
    event.preventDefault();
    let defaultCommentsTemplate = {
      // actions: [<span key="comment-list-reply-to-0">Reply to</span>],
      author: "Han Solo",
      avatar: "https://joeschmoe.io/api/v1/random",
      content: (
        <p>
          {commentText}
        </p>
      ),
      datetime: "" + new Date() + ""
    }
    currentComments.push(defaultCommentsTemplate);
    let completeData = props.completeData

    completeData[i].comments = currentComments
    props.setTable(completeData)
    updateCommentText("")
    // console.log(document.getElementsByClassName('comments-add-overlay'),document.getElementsByClassName('comments-add-overlay')[0].classList)
    //   document.getElementsByClassName('comments-add-overlay')[0].classList.add('ant-popover-hidden'); 


  }

  return (
    <>
      <div>
        <Popover overlayClassName="comments-overlay"
          content={<List
            className="comment-list"
            itemLayout="horizontal"
            dataSource={props.record.comments}
            renderItem={(item) => (
              <li>
                <Comment
                  actions={item.actions}
                  author={item.author}
                  avatar={item.avatar}
                  content={item.content}
                  datetime={formateDatetime(item.datetime)}
                />
              </li>
            )}
          />} trigger="click">
          <a href="" className="comments"><span className="num">{props.record.comments.length}</span></a>

        </Popover>

        <Popover overlayClassName="comments-add-overlay"
          // onVisibleChange={(i)=>handlePopoverVisibleChange(i)}
          content={
            <div>
              <span style={{ display: "block" }} className="AddaComment">Add a comment</span>
              <input type="text" placeholder="Write Here" id="commentInput" value={commentText} onKeyPress={(e) => enterCommentLine(e, props.i, props.record.comments)} onChange={onCommentChange} />
              <input type="checkbox" id="VisibleToAll" name="VisibleToAll" value="VisibleToAll" /><p className="visibletoallText">Visible To All</p>
              <button onClick={(e) => submitCommentLine(e, props.i, props.record.comments)} type="submit"
                className="comments-button">Post</button>
            </div>
          } trigger="click">

          <a href="" onClick={() => { }} className="addComment"><PlusOutlined style={{ color: 'black' }} /></a>

        </Popover>
      </div>
    </>
  );
}

export default Comments;
