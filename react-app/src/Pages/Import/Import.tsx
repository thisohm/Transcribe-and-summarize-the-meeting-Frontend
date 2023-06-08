import {FC,useState} from 'react';
import './../../index.css';
import { Steps } from 'antd';
import FileInfo from './Components-Import/FileInfo';
import AgendaInfo from './Components-Import/AgendaInfo';
import ImportInfo from './Components-Import/ImportInfo';


export type fileinfoType = {
  meettype:string
	meetapp:string
	location:string
	topic:string
  meetdate:string
  meettime:string
}

const fileDataDeclear : fileinfoType = {
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

  //disable for step
  const [disStep2,setDisStep2] = useState(true)
  const [disStep3,setDisStep3] = useState(true)

  //state for fileinfo
  const [fileData,setFileData] = useState<fileinfoType>(fileDataDeclear)

  //state for agendainfo
  const [state,setState] = useState<any>([]) //initial fields
  const [agendaData,setAgendaData] = useState<any>([])

  //state for ImportInfo
  const [title,setTitle] = useState("")

  //next step
  const nextStep = () =>{
    setStep(step + 1)
  }

  //back step
  const backStep = () =>{
    setStep(step - 1)
  }

  //component form
  const forms = [
	<FileInfo nextStep={nextStep} setDisStep2={setDisStep2} fileData={fileData} setFileData={setFileData} />,
	
  <AgendaInfo nextStep={nextStep} backStep={backStep} setDisStep3={setDisStep3} agendaData={agendaData} 
  setAgendaData={setAgendaData} state={state} setState={setState}/>,
	
  <ImportInfo backStep={backStep} title={title} setTitle={setTitle} 
  fileData={fileData} agendaData={agendaData}/>
  ]

  return (
	<>
    <p style={{padding:"15px"}}>Create Meetings</p>
      <Steps style={{padding:"20px",margin:"auto"}} onChange={setStep} current={step}>
        <Steps.Step title="File Information"/>
        <Steps.Step disabled={disStep2} title="Agenda Information"/>
        <Steps.Step disabled={disStep3} title="Import File"/>
      </Steps>
	    {forms[step]}
  </>
  )
}

export default Import