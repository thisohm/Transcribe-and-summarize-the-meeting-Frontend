import {FC,useState} from 'react';
import './../index.css';
import { Steps } from 'antd';
import FileInfo from '../Components/FileInfo';
import AgendaInfo from '../Components/AgendaInfo';
import ImportInfo from '../Components/ImportInfo';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import moment from 'moment';

dayjs.extend(localeData);

export type FormData = {
	//FileInfo
  meettype:string
	meetapp:string
	location:string
	topic:string
  //AgendaInfo
  agendaTopic:string
  detail:string
}

const INITIAL_DATA: FormData = {
	meettype:"",
	meetapp:"",
	location:"",
	topic:"",
  agendaTopic:"",
  detail:""
}

const Import:FC = () => {

  //state for step
  const [step,setStep] = useState(0)

  //state for form data
  const [formData,setFormData] = useState<FormData>(INITIAL_DATA)
  const [meetdate,setMeetDate] = useState(moment().format("YYYY-MM-DD"))
  const [meettime,setMeetTime] = useState(moment().format("HH:mm:ss"))

  //next step
  const nextStep = () =>{
    setStep(step + 1)
  }

  //back step
  const backStep = () =>{
    setStep(step - 1)
  }

  //set data
  const handleInputData = (input:any) => (e:any) =>{
	  const {value} = e.target

	  setFormData((prevState) => ({
		  ...prevState,
		  [input]: value
	  }))
  }

  //set data select
  const handleSelect = (input:any) => (value:any) =>{

	  setFormData((prevState) => ({
		  ...prevState,
		  [input]: value
	  }))
  }

  //set data date time
  const handleDate = (value:any,valuestring:any) =>{
	  setMeetDate(valuestring)
  }
  const handleTime = (value:any,valuestring:any) =>{
	  setMeetTime(valuestring)
  }

  //component form
  const forms = [
	<FileInfo nextStep={nextStep} handleFormData={handleInputData} handleSelect={handleSelect}  
  handleDate={handleDate} handleTime={handleTime} values={formData} meetdate={meetdate} meettime={meettime}/>,
	<AgendaInfo nextStep={nextStep} backStep={backStep} handleFormData={handleInputData} values={formData} />,
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