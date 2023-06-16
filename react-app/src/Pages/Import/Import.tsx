import {FC,useState} from 'react';
import './../../index.css';
import { Steps } from 'antd';
import FileInfo from './Components-Import/FileInfo';
import AgendaInfo from './Components-Import/AgendaInfo';
import ImportInfo from './Components-Import/ImportInfo';
import ResultPage from './Components-Import/ResultPage';


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
  const [disStep1,setDisStep1] = useState(false)
  const [disStep2,setDisStep2] = useState(true)
  const [disStep3,setDisStep3] = useState(true)
  const [disStep4,setDisStep4] = useState(true)

  //state for fileinfo
  const [fileData,setFileData] = useState<fileinfoType>(fileDataDeclear)

  //state for agendainfo
  const [state,setState] = useState<any>([]) //initial fields
  const [agendaData,setAgendaData] = useState<any>([])

  //state for ImportInfo
  const [title,setTitle] = useState("")
  const [meetId,setMeetId] = useState("")
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
	
  <ImportInfo backStep={backStep} nextStep={nextStep} setDisStep1={setDisStep1} setDisStep2={setDisStep2} 
  setDisStep3={setDisStep3} setDisStep4={setDisStep4} title={title} setTitle={setTitle} meetId={meetId} 
  setMeetId={setMeetId} fileData={fileData} agendaData={agendaData}/>,

  <ResultPage />
  ]

  return (
	<>
    <p style={{padding:"15px"}}>Create Meetings</p>
      <Steps style={{padding:"50px",margin:"auto"}} onChange={setStep} current={step}
        items={[
          {
            disabled: disStep1,
            title: "File Information"
          },
          {
            disabled: disStep2,
            title: "Agenda Information"
          },
          {
            disabled: disStep3,
            title: "Import File"
          },
          {
            disabled: disStep4,
            title: "Finish"
          }
        ]}
        >
      </Steps>
	    {forms[step]}
  </>
  )
}

export default Import