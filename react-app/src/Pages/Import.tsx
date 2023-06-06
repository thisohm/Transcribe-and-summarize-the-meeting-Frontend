import {FC,useState} from 'react';
import './../index.css';
import { Steps } from 'antd';
import FileInfo from '../Components/FileInfo';
import AgendaInfo from '../Components/AgendaInfo';
import ImportInfo from '../Components/ImportInfo';
import moment from 'moment';

export type fileinfoType = {
  meettype:string
	meetapp:string
	location:string
	topic:string
  meetdate:string
  meettime:string
}

const fileData : fileinfoType = {
	meettype:"",
	meetapp:"",
	location:"",
	topic:"",
  meetdate:"",
  meettime:""
}

const agenData = {
  agentopic:"",
  agendetail:"",
  agentime: ""
}

const Import:FC = () => {

  //state for step
  const [step,setStep] = useState(0)

  //state for fileinfo
  const [formData,setFormData] = useState<fileinfoType>(fileData)
  const [meetdate,setMeetDate] = useState(moment().format("YYYY-MM-DD"))
  const [meettime,setMeetTime] = useState(moment().format("HH:mm:ss"))

  //state for agendainfo
  const [state,setState] = useState<any>([]) //initial form
  const [agendaData,setAgendaData] = useState<any>([])

  //next step
  const nextStep = () =>{
    setStep(step + 1)
  }

  //back step
  const backStep = () =>{
    setStep(step - 1)
  }

  //set data FileInfo
  const handleInputData = (input:any) => (e:any) =>{
	  const {value} = e.target

	  setFormData((prevState) => ({
		  ...prevState,
		  [input]: value
	  }))
  }

  //set data Select for FileInfo
  const handleSelect = (input:any) => (value:any) =>{

	  setFormData((prevState) => ({
		  ...prevState,
		  [input]: value
	  }))
  }

  /*
  //set datetime for FileInfo
  const handleDate = (value:any,valuestring:any) =>{
	  setMeetDate(valuestring)
  }
  const handleTime = (value:any,valuestring:any) =>{
	  setMeetTime(valuestring)
  }
  */

  //console.log(formData)
  //console.log(agendaData)

  //component form
  const forms = [
	<FileInfo nextStep={nextStep} handleFormData={handleInputData} handleSelect={handleSelect} values={formData} />,
	
  <AgendaInfo nextStep={nextStep} backStep={backStep}
  values={agendaData} setValues={setAgendaData} state={state} setState={setState}/>,
	
  <ImportInfo backStep={backStep}/>
  ]

  return (
	<>
      <p style={{padding:"15px"}}>Create Meetings</p>
      <Steps style={{padding:"20px",margin:"auto"}} onChange={setStep} current={step}>
        <Steps.Step title="File Information"/>
        <Steps.Step title="Agenda Information"/>
        <Steps.Step title="Import File"/>
      </Steps>
	  {forms[step]}
    </>
  )
}

export default Import