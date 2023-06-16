import {useState} from 'react'
import './../../../index.css';
import 
  {
    Button, Form, Upload,Input, UploadFile
  } from 'antd';
import
  {
    InboxOutlined,
  } from '@ant-design/icons';
import axios from 'axios';

const ImportInfo = ({backStep,nextStep,setDisStep1,setDisStep2,setDisStep3,setDisStep4,
                    title,setTitle,meetId,setMeetId,fileData,agendaData}:any) =>{

  const [finish,setFinish] = useState(false)
  const [fileUpload,setFileUpload] = useState<UploadFile[]>([])
  
  //Post data to api
  const onSubmit = async() => {
    
    const formData = new FormData()
    const file:any = fileUpload[0]
    formData.append("file",file)
    formData.append("title",title)

    let fileConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/meeting/create',
      data: {
        meettype:fileData.meettype,meetapp:fileData.meetapp,location:fileData.location,
        topic:fileData.topic,meetdate:fileData.meetdate,meettime:fileData.meettime,
        agendaData
        }
    }
    
    let videoConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/video/create',
      headers: { 
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMDAwMDAteHh4eC15eXl5LXp6enotOTk5OTk5OTk5OTk5Iiwicm9sZV9pZCI6Ijk5OTk5OTk5LTAwMDAtMDAwMC0wMDAwLTk5OTk5OTk5OTk5OSIsIm9yZ19pZCI6IjAwMDAwMDAwLTk5OTktOTk5OS05OTk5LTAwMDAwMDAwMDAwMCIsImlhdCI6MTY4NDc2OTI2OCwiZXhwIjoxNzM1NjU4ODY4fQ.TSuHiEgv8GmquouVrrSuX1M9hl6ui8MzU9sWm-zFTbk'
      },
     data: formData
    }
    
    //Post File and Agen
    await axios.request(fileConfig)
    .then((response) => {
      console.log(response.data.message)
      formData.append("meeting_id",response.data.meet_id)
    })
    .catch((error) => {
      console.log(error)
    })
    
    //Post video
    await axios.request(videoConfig)
    .then((response) => {
      console.log(response.data.message)
    })
    .catch((error) => {
      console.log(error)
    })
    
    setFinish(true)
    if(!finish){
      setDisStep1(true)
      setDisStep2(true)
      setDisStep3(true)
      setDisStep4(false)
      nextStep()
    }
  }

  return (
    <Form onFinish={onSubmit}>
      <div style={{padding:"50px",margin:"auto",width:"800px"}}>

        <Form.Item 
          name="title" 
          label="title" 
          initialValue={title}
          rules={[{
          required:true, 
          message:"Please enter title"
          }]}
        >
          <Input onChange={(e)=>setTitle(e.target.value)} placeholder='title'/>
        </Form.Item>

        <Form.Item>
          <Upload.Dragger
            accept=".mp4,.mp3.wav"
            name="file"
            maxCount={1}
            beforeUpload={(file)=>{
              setFileUpload([...fileUpload,file])
              return false
            }}
            >
              <p className="ant-upload-drag-icon">
              <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single upload.
              </p>
          </Upload.Dragger>
        </Form.Item>
   
      </div>

        <Form.Item style={{padding:"20px"}}>
          <Button style={{marginRight:"5px"}} type='primary' onClick={backStep}>Back</Button>
            <Button 
              type="primary"
              htmlType="submit"
              >
              Submit
            </Button>
        </Form.Item>
    </Form>
  )
}

export default ImportInfo