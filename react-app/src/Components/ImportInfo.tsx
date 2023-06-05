import './../index.css';

import 
  {
    Button, Form, Upload
  } from 'antd';
import
  {
    InboxOutlined,
  } from '@ant-design/icons';


const ImportInfo = ({backStep}:any) =>{

  return (
    <Form>
    <div style={{padding:"50px",margin:"auto",width:"800px"}}>
    <Form.Item>
    <Upload.Dragger>
        <p className="ant-upload-drag-icon">
        <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
        Support for a single upload.
        </p>
        </Upload.Dragger>
    </Form.Item>
    </div>
    <Form.Item style={{padding:"20px"}}>
        <Button style={{marginRight:"5px"}} type='primary' onClick={backStep}>Back</Button>
        <Button className='btn-success' type='primary' htmlType='submit'>Submit</Button>
    </Form.Item>
    </Form>
  )
}

export default ImportInfo