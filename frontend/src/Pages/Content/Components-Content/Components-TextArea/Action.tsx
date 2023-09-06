import React from 'react'
import {Input} from 'antd'

const { TextArea } = Input;

const Action = ({file_extention,setFollow,follow}:any) => {
    return (
        <TextArea
            value={follow}
            style={{padding:"auto"}}
            autoSize={{ minRows: (file_extention==="mp4") ? 30.18 : 23.8, maxRows: (file_extention==="mp4") ? 30.18 : 23.8}}
            onChange={(e:any) => setFollow(e.target.value)}
        />
      )
}
export default Action
