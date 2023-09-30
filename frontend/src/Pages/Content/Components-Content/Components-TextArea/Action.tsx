import React from 'react'
import {Input} from 'antd'

const { TextArea } = Input;

const Action = ({file_extention,setAction,action}:any) => {
    return (
        <TextArea
            value={action}
            style={{padding:"auto",fontSize:"16px"}}
            autoSize={{ minRows: (file_extention==="mp4") ? 26.55 : 21.85, maxRows: (file_extention==="mp4") ? 26.55 : 21.85}}
            onChange={(e:any) => setAction(e.target.value)}
        />
      )
}
export default Action
