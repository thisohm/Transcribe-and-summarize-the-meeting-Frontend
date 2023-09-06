import React from 'react'
import {Input} from 'antd'

const { TextArea } = Input;

const Content = ({file_extention,setContent,content}:any) => {
  return (
    <TextArea
        value={content}
        style={{padding:"auto"}}
        autoSize={{ minRows: (file_extention==="mp4") ? 30.18 : 23.85, maxRows: (file_extention==="mp4") ? 30.18 : 23.85 }}
        onChange={(e:any) => setContent(e.target.value)}
    />
  )
}
export default Content
