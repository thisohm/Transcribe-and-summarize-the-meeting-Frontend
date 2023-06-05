import './../index.css';
import 
  {
     Button, Form, Input, Space,TimePicker
  } from 'antd';
import
  {
    PlusSquareOutlined,
    MinusCircleOutlined,
  } from '@ant-design/icons';

const AgendaInfo = ({ backStep, nextStep, handleFormData, handleTime, values, meettime }:any) =>{
 
  return (
    <>
    <Form onFinish={nextStep}>
      <div style={{padding:"50px",margin:"auto",width:"800px"}}>
        <Form.List name="topicList">
          {(fields,{add,remove})=>(
            <>
              {fields.map((field)=>{
                return(
                <Space key={field.key} direction="horizontal" size={12} >
                  <Form.Item name={[field.name,"agendaTopic"]} label="Agenda Topic"  rules={[{required:true, message:'Topic is required'}]}>
                    <Input placeholder="Topic"></Input>
                  </Form.Item>
                  <Form.Item name={[field.name,"detail"]} label="Detail" rules={[{required:true, message:'Detail is required'}]}>
                    <Input placeholder="Detail"></Input>
                  </Form.Item>
                  <Form.Item name={[field.name,"time"]} label="Time" rules={[{required:true, message:'Time is required'}]}>
                    <TimePicker onChange={handleTime} name="time"></TimePicker>
                  </Form.Item>
                  <MinusCircleOutlined style={{height:40,color:"red"}} onClick={()=>{
                  remove(field.name);
                        }}/>
                </Space>
                )
              })}
              <Form.Item>
                <Button icon={<PlusSquareOutlined/>} type="dashed" block onClick={()=>{
                  add();
                }}>
                  Add Topic Detail
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        </div>
        <Form.Item style={{padding:"20px"}}>
            <Button style={{marginRight:"5px"}} type='primary' onClick={backStep}>Back</Button>
            <Button type='primary' htmlType='submit'>Next</Button>
        </Form.Item>

      </Form>
    </>
  )
}

export default AgendaInfo