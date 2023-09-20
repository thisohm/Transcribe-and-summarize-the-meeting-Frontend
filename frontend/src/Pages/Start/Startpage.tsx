import {FC} from 'react'
import {Button,Layout, Space} from "antd"
import { useNavigate } from "react-router-dom";
import {
  VideoCameraOutlined,
  PlusSquareOutlined
} from '@ant-design/icons';
const { Content } = Layout;


const Startpage : FC = () => {
    
    const navigate = useNavigate()

  return (
    <>
      <Layout style={{margin:"auto",paddingTop:"250px"}}>
            <Content>
                <center>
                  <h1 style={{fontSize:"40px"}}>TRANSCRIBE AND SUMMARIZE THE MEETING</h1>
                  <h1 style={{fontSize:"40px"}}>WEB APPLICATION</h1>
                  <Space style={{paddingTop:"60px"}}>
                    <Button type="primary" onClick={()=>navigate('/meeting')}><VideoCameraOutlined/>Meetings</Button>
                    <Button onClick={()=>navigate('/import')}><PlusSquareOutlined/>Create Meetings</Button>
                  </Space>
                </center>
            </Content>
        </Layout>
    </>
  )
}

export default Startpage