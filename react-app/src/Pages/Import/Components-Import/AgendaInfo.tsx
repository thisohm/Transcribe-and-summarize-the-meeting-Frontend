import './../../../index.css';
import 
{
   Button, Form, Input, Space
} from 'antd';
import
{
  PlusSquareOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

const AgendaInfo = ({ backStep, nextStep, setDisStep3, agendaData,setAgendaData,state,setState }:any) =>{

  //add agenda to state
  const handleInputData = (e:any,i:any) =>{
	  const {name,value} = e.target

    const data = [...agendaData]
    data[i][name] = value
    setAgendaData(data)
  }

  //add initial topic
  const initialTopic = (i:any)=>{
     return agendaData[i].agentopic
  }

  //add initial detail
  const initialDetail = (i:any)=>{
    return agendaData[i].agendetail
  }

  //add initial time
  const initialTime = (i:any)=>{
    return agendaData[i].agentime
  }

  //add initial fields
  const blank = {}

  //add fields
  const handleAdd = () =>{
    setAgendaData([...agendaData,{
      agentopic:"",
      agendetail:"",
      agentime: ""
      }])
    setState([...state,blank])
  }

  //del fields and initial fields
  const handleDelete = (i:any)=>{
    const deleteVal = [...agendaData]
    const deleteFiedls = [...state]
    deleteVal.splice(i,1)
    deleteFiedls.splice(i,1)
    setAgendaData(deleteVal)
    setState(deleteFiedls)
  }

  // set next step and disabled
  const onFinish = () => {
    nextStep()
    setDisStep3(false)
  }
  return(
    
    <Form onFinish={onFinish}>
      <div style={{padding:"auto",margin:"auto",width:"1100px"}}>

        <Form.List initialValue={state} name="AgenList">
          {(values, { add, remove }) => (
            <>
              {values.map(({key, name, ...restField }) => (
                <Space key={key} direction="horizontal" size={12}>

                  <Form.Item
                    {...restField}
                    name={[name, "agentopic"]}
                    label="Topic"
                    initialValue={initialTopic(name)}
                    rules={[{ 
                      required: true, 
                      message: "Please enter topic"
                    }]}
                    style={{width:"200px"}}
                  >
                    <Input name="agentopic" onChange={(e)=>handleInputData(e,name)} placeholder="topic" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "detail"]}
                    label="Detail"
                    initialValue={initialDetail(name)}
                    rules={[{ 
                      required: true, 
                      message: "Please enter detail" 
                    }]}
                    style={{width:"700px"}}
                  >
                    <Input name='agendetail' onChange={(e)=>handleInputData(e,name)} placeholder="detail" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "agentime"]}
                    label="Time"
                    initialValue={initialTime(name)}
                    rules={[{ 
                      required: true, 
                      message: "Please enter time"
                    }]}
                    style={{width:"200px"}}
                  >
                    <Input name="agentime" onChange={(e)=>handleInputData(e,name)} type="time" step="1" placeholder="Time"/>
                  </Form.Item>

                  <MinusCircleOutlined style={{height:40,color:"red"}} 
                    onClick={() => {
                    remove(name) 
                    handleDelete(name)
                    }} 
                  />

                </Space>
            ))}
            
              <Form.Item>
                <Button type="dashed" disabled={values.length>4} 
                  onClick={() => {
                  add()
                  handleAdd()
                  }} 
                  block 
                  icon={<PlusSquareOutlined />}
                >
                  Add field
                </Button>
              </Form.Item>

            </>
          )}
        </Form.List>

      </div>

        <Form.Item style={{padding:"20px"}}>
          <Button style={{marginRight:"5px"}} type="primary" htmlType="submit" onClick={backStep}>Back</Button>
          <Button type="primary" htmlType="submit">Next</Button>
        </Form.Item>
    
    </Form>
  )
}

export default AgendaInfo