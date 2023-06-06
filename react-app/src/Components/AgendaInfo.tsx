import './../index.css';
import 
{
   Button, Form, Input, Space
} from 'antd';
import
{
  PlusSquareOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

const AgendaInfo = ({ backStep, nextStep,values,setValues,state,setState }:any) =>{

  //add agenda to state
  const handleInputData = (e:any,i:any) =>{
	  const {name,value} = e.target

    const data = [...values]
    data[i][name] = value
    setValues(data)
  }

  //add initial topic
  const initialTopic = (i:any)=>{
     return values[i].agentopic
  }

  //add initial detail
  const initialDetail = (i:any)=>{
    return values[i].agendetail
  }

  //add initial time
  const initialTime = (i:any)=>{
    return values[i].agentime
  }

  //add form and initial form
  const blank = {}

  const handleAdd = () =>{
    setValues([...values,{
      agentopic:"",
      agendetail:"",
      agentime: ""
      }])
    setState([...state,blank])
  }

  //del form and initial form
  const handleDelete = (i:any)=>{
    const deleteVal = [...values]
    const deleteForm = [...state]
    deleteVal.splice(i,1)
    deleteForm.splice(i,1)
    setValues(deleteVal)
    setState(deleteForm)
  }

  return(
    
    <Form onFinish={nextStep}>
      <div style={{padding:"50px",margin:"auto",width:"800px"}}>
      <Form.List initialValue={state} name="AgenList">
        {(values, { add, remove }) => (
          <>
            {values.map(({key, name, ...restField }) => (
              <Space key={key} direction="horizontal" size={12}>
                <Form.Item
                  {...restField}
                  name={[name, 'agentopic']}
                  label="Topic"
                  initialValue={initialTopic(name)}
                  rules={[{ required: true, message: 'Please enter topic' }]}
                >
                  <Input defaultValue={initialTopic(name)} name='agentopic' onChange={(e)=>handleInputData(e,name)} placeholder="topic" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'detail']}
                  label="Detail"
                  initialValue={initialDetail(name)}
                  rules={[{ required: true, message: 'Please enter detail' }]}
                >
                  <Input defaultValue={initialDetail(name)} name='agendetail' onChange={(e)=>handleInputData(e,name)} placeholder="detail" />
                </Form.Item>
                <Form.Item
                {...restField}
                name={[name, 'agentime']}
                label="Time"
                initialValue={initialTime(name)}
                rules={[{ required: true, message: 'Please enter time' }]}
                >
                  <Input defaultValue={initialTime(name)} name='agentime' onChange={(e)=>handleInputData(e,name)} type="time" step="1" placeholder="Time"/>
                </Form.Item>
                <MinusCircleOutlined style={{height:40,color:"red"}} 
                onClick={() => {
                  remove(name) 
                  handleDelete(name)
                  }} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" disabled={values.length>4} 
              onClick={() => {
                add()
                handleAdd()
              }} block icon={<PlusSquareOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </div>

      <Form.Item style={{padding:"20px"}}>
        <Button style={{marginRight:"5px"}} type='primary' htmlType='submit' onClick={backStep}>Back</Button>
        <Button type='primary' htmlType='submit'>Next</Button>
      </Form.Item>
    
    </Form>
  )
}
export default AgendaInfo