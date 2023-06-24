import {FC} from 'react'
import './../../index.css';
import {Button,Layout,Row,Col} from "antd"
import Table from './Components-Meeting/Table';
import {
    PlusSquareOutlined
} from "@ant-design/icons"
const { Content } = Layout;

const Meeting: FC = () => {
    return(
        <Layout style={{margin:"10px"}}>
            <Content>
                <Row justify={'space-between'}>
                    <Col>
                        <p style={{padding:"15px",fontSize:"16px"}}>Meeting</p> 
                    </Col>
                    <Col style={{padding:"15px"}}>
                        <Button type="primary" href="/import"><PlusSquareOutlined />Create Meetings</Button>
                    </Col>
                </Row>
                <div style={{padding:"25px",margin:"auto",width:"auto"}}>
                <Table/>
                </div>
                
            </Content>
        </Layout>
    )
}

export default Meeting