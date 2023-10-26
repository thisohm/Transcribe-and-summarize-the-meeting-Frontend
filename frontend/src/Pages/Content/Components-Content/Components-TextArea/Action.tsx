import React from 'react'
import {Input} from 'antd'

const { TextArea } = Input;

const Action = ({file_extention,setAction,action}:any) => {
    return (
        <TextArea
            value={action}
            style={{padding:"auto",fontSize:"16px"}}
            autoSize={{ minRows: 26.1, maxRows: 26.1}}
            onChange={(e:any) => setAction(e.target.value)}
        />
      )
}
export default Action
