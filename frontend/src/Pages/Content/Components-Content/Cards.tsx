import React,{useState} from 'react'
import { Card } from "antd"

const tabList = [
    {
        key: 'tab1',
        tab: 'tab1'
    },
    {
        key: 'tab2',
        tab: 'tab2'
    }
]

const contentList: Record<any, React.ReactNode> = {
    tab1: <p>Content1</p>,
    tab2: <p>Content2</p>
}

const Cards = () => {

    const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1');
  
    const onTab1Change = (key: string) => {
      setActiveTabKey1(key);
    };

  return (
    <>
      <Card
        style={{}}
        extra=""
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </>
  )
}

export default Cards