import {FC,useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {Row, Col, Layout, Space, Button, Input, Modal} from 'antd'
import { 
  ExportOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LeftOutlined
} from '@ant-design/icons'
import CardsVideo from "./Components-Content/CardsVideo"
import CardsAudio from './Components-Content/CardsAudio'
import dayjs from "dayjs"
import { Link } from 'react-router-dom';
import { Footer } from 'antd/es/layout/layout'
const { Content } = Layout;
const { TextArea,Search } = Input;

const ContentVideo:FC = () => {
    const { meeting_id } = useParams()
    const [dataMeeting,setDataMeeting] = useState([])
    const [dataAgenda,setDataAgenda] = useState([])
    const [dataVideo,setDataVideo] = useState([])
    const [demo_url,setURL] = useState('');
    const [follow,setFollow] = useState([])
    const [content,setContent] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    //load data
    useEffect(() => {
        loadDataMeeting(meeting_id)
        //loadDataAgenda(meeting_id)
        loadDataVideo(meeting_id)
    }, [meeting_id])

    //localstorage follow
    useEffect(() => {
      const data = localStorage.getItem(String(meeting_id+'follow'))
      if (data) {
        setFollow(JSON.parse(data))
      }
    }, [])
    useEffect(() => {
      localStorage.setItem(String(meeting_id+'follow'),JSON.stringify(follow))
    })

    //localstorage content
    useEffect(() => {
      const data = localStorage.getItem(String(meeting_id+'content'))
      if (data) {
        setContent(JSON.parse(data))
      }
    }, [])
    useEffect(() => {
      localStorage.setItem(String(meeting_id+'content'),JSON.stringify(content))
    })

    //modal export
    const showModal = () => {
      setIsModalOpen(true);
    }
  
    const handleOk = () => {
      setIsModalOpen(false);
    }
  
    const handleCancel = () => {
      setIsModalOpen(false);
    }

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
    const onSearch = (value:String) =>{
      console.log(value)
    }
  return (
    <>
    {
      dataVideo.map((item:any,index:any)=>{
        const file_extention = ((item.video_path).substring((item.video_path).lastIndexOf(".") + 1))
        
        if(file_extention === "mp4"){ //vidoe file
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{paddingBottom:"10px"}}>
                        <Link to={`/`} style={{color:"black"}}>
                        <LeftOutlined/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", paddingBottom:"10px"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px"}}>{SecToTimeHMS(item.duration)}</p>
                                  </div>
                                )
                                })
                            }
                          </Space>
                        </div>
                        )
                    })
                  }
                </Col>
                <Col>
                  <Space>
                    <Search 
                      placeholder="input search text" 
                      onSearch={onSearch} 
                      enterButton 
                    />
                    <Button type="primary" onClick={showModal}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                    <Modal title="Export file" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                      <p>Some contents...</p>
                      <p>Some contents...</p>
                      <p>Some contents...</p>
                    </Modal>
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}}>
                <Row style={{height:"580px",marginBottom:"20px"}}>
                  <Col span={12} style={{paddingRight:"20px"}}>
                  <video 
                      style={{width:"100%"}}
                      controls preload="metadata" 
                      //onTimeUpdate ={handleWatchComplete}
                    > 
                      {
                        dataVideo.map((item:any,index:any) => {
                          return(                    
                            <source key={index} src={'http://localhost:13001/api/video/download?video_id='+ item.video_id} type="video/mp4"/>     
                          )
                        })
                      }
                      <track
                        label="English"
                        kind="subtitles"
                        src={demo_url}
                        default />
                    </video>
                  </Col>
                  <Col span={12}>
                    <CardsVideo/>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{paddingRight:"20px"}}>
                    <p style={{fontSize:"16px",paddingBottom:"10px"}}>Follow</p>
                    <TextArea
                      value={follow}
                      style={{padding:"auto"}}
                      autoSize={{ minRows: 8, maxRows: 8 }}
                      onChange={(e:any) => setFollow(e.target.value)}
                    />
                  </Col>
                  <Col span={12}>
                    <p style={{fontSize:"16px",paddingBottom:"10px"}}>Content</p>
                    <TextArea
                      value={content}
                      style={{padding:"auto"}}
                      autoSize={{ minRows: 8, maxRows: 8 }}
                      onChange={(e:any) => setContent(e.target.value)}
                    />
                  </Col>
                </Row>
              </Content>
            </Layout> 
          )
        }
        if(file_extention === "mp3"){ //audio file
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{paddingBottom:"10px"}}>
                        <Link to={`/`} style={{color:"black"}}>
                        <LeftOutlined/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", paddingBottom:"10px"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px"}}>{SecToTimeHMS(item.duration)}</p>
                                  </div>
                                )
                                })
                            }
                          </Space>
                        </div>
                        )
                    })
                  }
                </Col>
                <Col>
                  <Space>
                    <Search 
                      placeholder="input search text" 
                      onSearch={onSearch} 
                      enterButton 
                    />
                    <Button type="primary" onClick={showModal}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                    <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                      <p>Some contents...</p>
                      <p>Some contents...</p>
                      <p>Some contents...</p>
                    </Modal>
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}} >
                <Row>
                  <Col span={12} style={{paddingRight:"20px",paddingBottom:"20px"}}>
                    <div style={{paddingBottom:"10px"}}>
                    <p style={{fontSize:"16px",paddingBottom:"10px"}}>Follow</p>
                      <TextArea
                        value={follow}
                        style={{padding:"auto"}}
                        autoSize={{ minRows: 15, maxRows: 15 }}
                        onChange={(e:any) => setFollow(e.target.value)}
                      />
                    </div>
                    <div>
                    <p style={{fontSize:"16px",paddingBottom:"10px"}}>Content</p>
                      <TextArea
                        value={content}
                        style={{padding:"auto"}}
                        autoSize={{ minRows: 15, maxRows: 15 }}
                        onChange={(e:any) => setContent(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <CardsAudio/>
                  </Col>
                </Row>
              </Content>
              <Footer style={{padding:"0px"}}>
                <audio 
                  style={{width:"100%"}}
                  controls preload="metadata" 
                  //onTimeUpdate ={handleWatchComplete}
                > 
                  {
                    dataVideo.map((item:any,index:any) => {
                      return(                    
                        <source key={index} src={'http://localhost:13001/api/video/download?video_id='+ item.video_id} type="audio/mp3"/>     
                      )
                    })
                  }
                </audio>
              </Footer>
            </Layout> 
          )   
        }
      })
    }
    </> 
  )
}

//Change seconds to hh:mm:ss
function SecToTimeHMS(timeInSeconds:any) {
  var pad = function(num:any, size:any) { return ('000' + num).slice(size * -1); },
  time:any = parseFloat(timeInSeconds).toFixed(3),
  hours = Math.floor(time / 60 / 60),
  minutes = Math.floor(time / 60) % 60,
  seconds = Math.floor(time - minutes * 60)
  
  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
  
}

export default ContentVideo