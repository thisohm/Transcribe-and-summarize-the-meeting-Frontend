import './../index.css';
import
  {
    Button, Form, Input, Select, DatePicker,TimePicker
  } from 'antd';

import dayjs from "dayjs";
const dateFormat = "YYYY-MM-DD"
const timeFormat = "HH:mm:ss"

  const FileInfo = ({ nextStep, handleFormData, handleSelect, handleDate, handleTime,
    values,meetdate,meettime }:any) => {
    

  return (

    <Form onFinish={nextStep}>
          <div style={{padding:"50px",margin:"auto",width:"800px"}}>
              {/*Meeting Type*/}
              <Form.Item initialValue={values.meettype} name={"meettype"} label="Meeting Type" rules={[{ required: true , message:'Meeting Type is required'}]}>
                <Select
                  placeholder="Select a meeting type"
                  onSelect={handleSelect("meettype")}
                  defaultValue={values.meettype}
                  allowClear
                  options={[
                    {label:"Meeting Online", value:"Meeting Online"},
                    {label:"Meeting Offline", value:"Meeting Offline"}
                  ]}
                />
              </Form.Item>
            
               {/*Select Meeting Type*/}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.meettype !== currentValues.meettype}
              >
                {({ getFieldValue }) =>
                  getFieldValue('meettype') === 'Meeting Online' ? (
                    <Form.Item initialValue={values.meetapp} name={"meetapp"} label="Meeting Application" rules={[{ required: true , message:'Meeting Application is required'}]}>
                      <Input defaultValue={values.meetapp} onChange={handleFormData("meetapp")} />
                    </Form.Item>
                  ) : null
                  
                }
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.meettype !== currentValues.meettype}
              >
                {({ getFieldValue }) =>
                  getFieldValue('meettype') === 'Meeting Offline'? (
                    <Form.Item initialValue={values.location} name={"location"} label="Location" rules={[{ required: true,  message:'Location is required'}]}>
                      <Input defaultValue={values.location} onChange={handleFormData("location")}/>
                    </Form.Item>
                  ) : null
                  
                }
              </Form.Item>
              
              {/*Topic*/}
              <Form.Item 
                label="Topic"
                initialValue={values.topic}
                rules={[{required:true,message:'Topic is required'}]}
                name={"topic"}
                >
              <Input defaultValue={values.topic} onChange={handleFormData("topic")} placeholder="Enter a topic" />
              </Form.Item>
              
                {/*Date&Time*/}
                <Form.Item
              label='Date' 
              name={'meetdate'}
              initialValue={dayjs(meetdate, dateFormat)}
              rules={[{required:true, message:'Date is required',type:'object' as const}]}>
                <DatePicker defaultValue={dayjs(meetdate, dateFormat)} onChange={handleDate} placeholder="Select date" format={dateFormat}
                />
              </Form.Item>

              <Form.Item
              label='Time' 
              name={'meettime'}
              initialValue={dayjs(meettime, timeFormat)}
              rules={[{required:true, message:'Time is required',type:'object' as const}]}>
                <TimePicker defaultValue={dayjs(meettime, timeFormat)} onChange={handleTime} placeholder="Select time" format={timeFormat}
                />
              </Form.Item>
            
              </div>
              <Form.Item style={{padding:"20px"}}>
                <Button type='primary' htmlType='submit'>Next</Button>
              </Form.Item>
            </Form>
         
  )
}

export default FileInfo