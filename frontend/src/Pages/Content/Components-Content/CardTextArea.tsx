import React,{useState} from 'react';
import { Card,Button, message,Popconfirm } from 'antd';
import Action from './Components-TextArea/Action';
import Content from './Components-TextArea/Content';
import { RetweetOutlined } from '@ant-design/icons';

const CardTextArea = ({file_extention,setTab,setContent,content,setFollow,follow}:any) => {
  
  const [activeTabKey1, setActiveTabKey1] = useState<string>('content');
  
  const tabList = [
    {
      key: 'content',
      tab: 'Content',
    },
    {
      key: 'action',
      tab: 'Action',
    },
  ];
  
  const contentList: Record<string, React.ReactNode> = {
    content: <Content file_extention={file_extention} setContent={setContent} content={content}/>,
    action: <Action file_extention={file_extention} setFollow={setFollow} follow={follow}/>
  };

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
    setTab(key)
  };
  
  return (
    <div style={{paddingTop: (file_extention === "mp4") ? "0px" : "41.5px" }} >
      <Card
        style={{border:"1px solid gainsboro",borderRadius:"10px"}}
        extra= {
          <Popconfirm
            title= {(activeTabKey1 === "content") ? "Reset the content" : "Reset the action"}
            description={(activeTabKey1 === "content") ? "Are you sure to delete this content" : "Are you sure to delete this action"}
            onConfirm={(activeTabKey1 === "content") ?
            () => {
              setContent("")
              message.success("Reset content success")
            }
            :
            () => {
              setFollow("")
              message.success("Reset action success")
            }}
            okText="reset"
            cancelText="cancle"
          >
            <Button type="primary"> <RetweetOutlined />Reset</Button>
          </Popconfirm>
        }
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </div>
  )
}

export default CardTextArea
