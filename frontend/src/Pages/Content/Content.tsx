import React,{FC,useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Content:FC = () => {
    const { meeting_id } = useParams()
    const [dataMeeting,setDataMeeting] = useState([])
    const [dataAgenda,setDataAgenda] = useState([])
    const [dataVideo,setDataVideo] = useState([])

    //load data
    useEffect(() => {
        loadDataMeeting(meeting_id)
        loadDataAgenda(meeting_id)
        loadDataVideo(meeting_id)
    }, [meeting_id])

    const loadDataMeeting = async (meeting_id:any) => {

      let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:13001/api/meeting/meet-id-list',
          data: {meeting_id:meeting_id}
      }

      await axios.request(config)
      .then((response) => {
        setDataMeeting(response.data.meeting)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    const loadDataAgenda = async (meeting_id:any) => {

      let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:13001/api/meeting/meet-id-list',
          data: {meeting_id:meeting_id}
      }

      await axios.request(config)
      .then((response) => {
        setDataAgenda(response.data.agenda)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    const loadDataVideo = async (meeting_id:any) => {

      let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:13001/api/video/meet-id-list',
          data: {meeting_id:meeting_id}
      }
      
      await axios.request(config)
      .then((response) => {
        setDataVideo(response.data.result)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    //show data
    const datameeting = dataMeeting.map((item:any,index:any) => {
      return (
        <div key={index}>
          <p>Meeting_id: {item.meeting_id}</p>
          <p>Type: {item.meettype}</p>
          <p>Topic: {item.topic}</p>
          <p>Location: {item.location}</p>
          <p>Application: {item.meetapp}</p>
          <p>Date: {item.meetdate}</p>
          <p>Time: {item.meettime}</p>
          <p>Created_timestamp: {item.created_timestamp}</p>
        </div>
      )
    })

    const dataagenda = dataAgenda.map((item:any,index:any) => {
      return (
        <div key={index}>
          <p>Meeting_id: {item.meeting_id}</p>
          <p>Agenda_id: {item.agenda_id}</p>
          <p>Topic: {item.agentopic}</p>
          <p>Detail: {item.agendetail}</p>
          <p>Time: {item.agentime}</p>
          <br></br>
        </div>
      )
    })

    const datavideo = dataVideo.map((item:any,index:any) => {
      return (
        <div key={index}>
          <p>Title: {item.title}</p>
          <p>Video_id: {item.video_id}</p>
          <p>Meeting_id: {item.meeting_id}</p>
          <p>Duration: {item.duration}</p>
          <p>Created_timestamp: {item.created_timestamp}</p>
          <p>Status: {item.status}</p>
          <p>Video_path: {item.video_path}</p>
        </div>
      )
    })

  return (
    <>  
        <h1>Meeting</h1>
          {datameeting}
          <br></br>

        <h1>Agenda</h1>
          {dataagenda}
          <br></br>

        <h1>Video</h1>
          {datavideo}
    </>
  )
}

export default Content