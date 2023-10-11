import React from 'react'
import {Input} from 'antd'

const { TextArea } = Input;

const Content = ({file_extention,setContent,content}:any) => {
  return (
    <TextArea
        value={content}
        style={{padding:"auto",fontSize:"16px"}}
        autoSize={{ minRows: 26.55, maxRows: 26.55}}
        onChange={(e:any) => setContent(e.target.value)}
    />
  )
}
export default Content
