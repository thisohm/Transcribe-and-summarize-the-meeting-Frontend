import {FC,useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {Row, Col, Layout, Space, Button, Input,Divider} from 'antd'
import { 
  ExportOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LeftCircleFilled
} from '@ant-design/icons'
import CardsVideo from "./Components-Content/CardsVideo"
import CardsAudio from './Components-Content/CardsAudio'
import CardsAudioNoneTopic from './Components-Content/CardsAudioNoneTopic'
import CardsVideoNoneTopic from './Components-Content/CardsVideoNoneTopic'
import CardTextArea from './Components-Content/CardTextArea'
import Export from './Components-Content/Export'
import dayjs from "dayjs"
import { Link } from 'react-router-dom';
import { Footer } from 'antd/es/layout/layout'
import { RotatingLines } from  'react-loader-spinner'
const { Content } = Layout;
const { Search } = Input;

const ContentVideo:FC = () => {
    const { meeting_id } = useParams()
    const [dataMeeting,setDataMeeting]:any[] = useState([])
    const [dataMeetingEx,setDataMeetingEx]:any[] = useState([])
    const [dataAgenda,setDataAgenda] = useState(false)
    const [dataAgen,setDataAgen]:any[] = useState([])
    const [dataVideo,setDataVideo]:any[] = useState([])
    const [demo_url,setURL] = useState("")
    const [loading,setLoading] = useState(false)
    const [follow,setFollow] = useState("")
    const [content,setContent] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [keyword,setKeyword] = useState<String>("")
    const [tab,setTab] = useState<String>("content")

    //load data
    useEffect(() => {
        loadDataMeeting(meeting_id)
        loadDataAgenda(meeting_id)
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
    

    const loadDataMeeting = async (meeting_id:any) => {

          let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:13001/api/meeting/meet-id-list',
          data: {meeting_id:meeting_id},
      }

      await axios.request(config)
      .then((response) => {
        setDataMeeting(response.data.meeting)
        setDataMeetingEx(response.data.meeting[0])
        setLoading(true)
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
        if(response.data.agenda.length===0){
          setDataAgenda(false)
          setDataAgen(response.data.agenda)
        }
        if(response.data.agenda.length>0){
          setDataAgenda(true)
          setDataAgen(response.data.agenda)
        }
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
        downloadSub(response.data.result[0].video_id)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    const downloadSub = async (video_id:any) => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/subtitle/download?video_id='+video_id+'&extension=vtt',        
    }
    
    await axios.request(config)
    .then((response) => {
      const blob = new Blob([response.data]);      
      const sub_path = (window.URL || window.webkitURL).createObjectURL(blob);
      setURL(sub_path);
      setLoading(false)
      if(loading == false){
        console.log("Load data success")
      }
      if(loading == true){
        console.log("Load data error")
        setTimeout(function(){
          window.location.reload();
       }, 500);
      }
    })
    .catch((error) => {
      console.log(error)
    })
    }
    
    const onSearch = (value:String) =>{
      setKeyword(value)
    }

  return (
    <>
    { loading ?
      <div style={{margin:"auto",paddingTop:"450px"}}>
        <Divider orientation="center">
          <RotatingLines
          strokeColor="grey"
          strokeWidth="2"
          animationDuration="0.75"
          width="80"
          visible={true}
          />
        </Divider>
      </div>
    :
      dataVideo.map((item:any,index:any)=>{
        const file_extention = ((item.video_path).substring((item.video_path).lastIndexOf(".") + 1))
        
        if(file_extention === "mp4" && dataAgenda === true){ //vidoe file have topic
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{fontSize:"20px",paddingBottom:"10px"}}>
                        <Link to={`/meeting`} style={{color:"dodgerblue"}}>
                        <LeftCircleFilled/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", fontWeight:"bold",color:"#3F3F3F",paddingBottom:"10px"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px",color:"#3F3F3F"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px",color:"#3F3F3F"}}>{SecToTimeHMS(item.duration)}</p>
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
                      placeholder="Search text" 
                      onSearch={onSearch} 
                      enterButton
                      onChange={(e)=>{setKeyword(e.target.value)}} 
                    />
                    <Button type="primary" onClick={()=>setIsModalOpen(true)}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                      <Export 
                        ModalOpen={isModalOpen} 
                        setModalOpen={setIsModalOpen} 
                        video_id={dataVideo[0].video_id}
                        dataMeeting={dataMeetingEx}
                        dataAgenda={dataAgenda}
                        dataAgen={dataAgen}
                        dataVideo={dataVideo}
                      />
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}}>
                <Row style={{height:"390px",marginBottom:"10px"}}>
                  <Col span={10} style={{paddingRight:"20px"}}>
                  <video 
                      id="video"
                      style={{width:"100%",maxWidth:"700px",borderRadius:"8px"}}
                      controls preload="metadata" 
                    > 
                      {
                        dataVideo.map((item:any,index:any) => {
                          return(                    
                            <source key={index} src={'http://localhost:13001/api/video/download?video_id='+ item.video_id} type="video/mp4"/>     
                          )
                        })
                      }
                      <track
                        label="ซับไทย"
                        kind="subtitles"
                        src={demo_url}
                      />
                    </video>
                  </Col>
                  <Col span={14}>
                    <CardTextArea setTab={setTab} file_extention={file_extention} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
                <Row>
                  <Col span={10} style={{paddingRight:"20px"}}>
                    <CardsVideo tab={tab} dataMeeting={dataMeeting} dataAgen={dataAgen} dataVideo={dataVideo} keyword={keyword} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
              </Content>
            </Layout> 
          )
        }
        if(file_extention === "mp4" && dataAgenda === false){ //vidoe file none topic
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{fontSize:"20px",paddingBottom:"10px"}}>
                        <Link to={`/meeting`} style={{color:"dodgerblue"}}>
                        <LeftCircleFilled/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", paddingBottom:"10px",fontWeight:"bold",color:"#3F3F3F"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px",color:"#3F3F3F"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px",color:"#3F3F3F"}}>{SecToTimeHMS(item.duration)}</p>
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
                      placeholder="Search text" 
                      onSearch={onSearch} 
                      enterButton
                      onChange={(e)=>{setKeyword(e.target.value)}} 
                    />
                    <Button type="primary" onClick={()=>setIsModalOpen(true)}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                      <Export 
                        ModalOpen={isModalOpen} 
                        setModalOpen={setIsModalOpen} 
                        video_id={dataVideo[0].video_id}
                        dataMeeting={dataMeetingEx}
                        dataAgenda={dataAgenda}
                        dataAgen={dataAgen}
                        dataVideo={dataVideo}
                      />
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}}>
                <Row style={{height:"390px",marginBottom:"10px"}}>
                  <Col span={10} style={{paddingRight:"20px"}}>
                  <video 
                      id="video"
                      style={{width:"100%",maxWidth:"700px",borderRadius:"8px"}}
                      controls preload="metadata" 
                    > 
                      {
                        dataVideo.map((item:any,index:any) => {
                          return(                    
                            <source key={index} src={'http://localhost:13001/api/video/download?video_id='+ item.video_id} type="video/mp4"/>     
                          )
                        })
                      }
                      <track
                        label="ซับไทย"
                        kind="subtitles"
                        src={demo_url}
                      />
                    </video>
                  </Col>
                  <Col span={14}>
                    <CardTextArea setTab={setTab} file_extention={file_extention} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
                <Row>
                  <Col span={10} style={{paddingRight:"20px"}}>
                    <CardsVideoNoneTopic tab={tab} dataVideo={dataVideo} keyword={keyword} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
              </Content>
            </Layout>
          )
        }
        if(file_extention === "mp3" && dataAgenda === true){ //audio file have topic
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{fontSize:"20px",paddingBottom:"10px"}}>
                        <Link to={`/meeting`} style={{color:"dodgerblue"}}>
                        <LeftCircleFilled/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", paddingBottom:"10px",fontWeight:"bold",color:"#3F3F3F"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px",color:"#3F3F3F"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px",color:"#3F3F3F"}}>{SecToTimeHMS(item.duration)}</p>
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
                      placeholder="Search text" 
                      onSearch={onSearch} 
                      enterButton
                      onChange={(e)=>{setKeyword(e.target.value)}} 
                    />
                    <Button type="primary" onClick={()=>setIsModalOpen(true)}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                      <Export 
                        ModalOpen={isModalOpen} 
                        setModalOpen={setIsModalOpen} 
                        video_id={dataVideo[0].video_id}
                        dataMeeting={dataMeetingEx}
                        dataAgenda={dataAgenda}
                        dataAgen={dataAgen}
                        dataVideo={dataVideo}
                      />
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}} >
                <Row>
                  <Col span={12} style={{paddingRight:"20px",paddingBottom:"35px"}}>
                    {/*
                    <div style={{paddingBottom:"10px"}}>
                    <p style={{fontSize:"16px",paddingBottom:"20px"}}>Follow</p>
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
                    */}
                    <CardTextArea setTab={setTab} file_extention={file_extention} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                  <Col span={12}>
                    <CardsAudio tab={tab} dataMeeting={dataMeeting} dataAgen={dataAgen} dataVideo={dataVideo} keyword={keyword} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
              </Content>
              <Footer style={{padding:"0px"}}>
                <audio
                  id="audio" 
                  style={{width:"100%",borderRadius:"8px"}}
                  controls preload="metadata" 
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
        if(file_extention === "mp3" && dataAgenda === false){ //audio file none topic
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{fontSize:"20px",paddingBottom:"10px"}}>
                        <Link to={`/meeting`} style={{color:"dodgerblue"}}>
                        <LeftCircleFilled/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", paddingBottom:"10px",fontWeight:"bold",color:"#3F3F3F"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px",color:"#3F3F3F"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px",color:"#3F3F3F"}}>{SecToTimeHMS(item.duration)}</p>
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
                      placeholder="Search text" 
                      onSearch={onSearch} 
                      enterButton
                      onChange={(e)=>{setKeyword(e.target.value)}} 
                    />
                    <Button type="primary" onClick={()=>setIsModalOpen(true)}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                      <Export 
                        ModalOpen={isModalOpen} 
                        setModalOpen={setIsModalOpen} 
                        video_id={dataVideo[0].video_id}
                        dataMeeting={dataMeetingEx}
                        dataAgenda={dataAgenda}
                        dataAgen={dataAgen}
                        dataVideo={dataVideo}
                      />
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}} >
                <Row>
                  <Col span={12} style={{paddingRight:"20px",paddingBottom:"35px"}}>
                    {/*
                    <div style={{paddingBottom:"10px"}}>
                    <p style={{fontSize:"16px",paddingBottom:"20px"}}>Follow</p>
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
                    */}
                    <CardTextArea setTab={setTab} file_extention={file_extention} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                  <Col span={12}>
                    <CardsAudioNoneTopic tab={tab} dataVideo={dataVideo} keyword={keyword} content={content} setContent={setContent} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
              </Content>
              <Footer style={{padding:"0px"}}>
                <audio 
                  id="audio"
                  style={{width:"100%",borderRadius:"8px"}}
                  controls preload="metadata"
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
        if(file_extention === "wav" && dataAgenda === true){ //audio wav file have topic
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{fontSize:"20px",paddingBottom:"10px"}}>
                        <Link to={`/meeting`} style={{color:"dodgerblue"}}>
                        <LeftCircleFilled/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", paddingBottom:"10px",fontWeight:"bold",color:"#3F3F3F"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px",color:"#3F3F3F"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px",color:"#3F3F3F"}}>{SecToTimeHMS(item.duration)}</p>
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
                      placeholder="Search text" 
                      onSearch={onSearch} 
                      enterButton
                      onChange={(e)=>{setKeyword(e.target.value)}} 
                    />
                    <Button type="primary" onClick={()=>setIsModalOpen(true)}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                      <Export 
                        ModalOpen={isModalOpen} 
                        setModalOpen={setIsModalOpen} 
                        video_id={dataVideo[0].video_id}
                        dataMeeting={dataMeetingEx}
                        dataAgenda={dataAgenda}
                        dataAgen={dataAgen}
                        dataVideo={dataVideo}
                      />
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}} >
                <Row>
                  <Col span={12} style={{paddingRight:"20px",paddingBottom:"35px"}}>
                    {/*
                    <div style={{paddingBottom:"10px"}}>
                    <p style={{fontSize:"16px",paddingBottom:"20px"}}>Follow</p>
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
                   */}
                    <CardTextArea setTab={setTab} file_extention={file_extention} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                  <Col span={12}>
                    <CardsAudio tab={tab} dataMeeting={dataMeeting} dataAgen={dataAgen} dataVideo={dataVideo} keyword={keyword} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
              </Content>
              <Footer style={{padding:"0px"}}>
                <audio
                  id="audio" 
                  style={{width:"100%",borderRadius:"8px"}}
                  controls preload="metadata" 
                > 
                  {
                    dataVideo.map((item:any,index:any) => {
                      return(                    
                        <source key={index} src={'http://localhost:13001/api/video/download?video_id='+ item.video_id} type="audio/wav"/>     
                      )
                    })
                  }
                </audio>
              </Footer>
            </Layout> 
          )   
        }
        if(file_extention === "wav" && dataAgenda === false){ //audio wav file none topic
          return (
            <Layout key={index} style={{margin:"25px"}}>
              <Row style={{justifyContent:"space-between"}}>
                <Col>
                  {
                    dataMeeting.map((item:any,index:any) => {
                      return(
                      <div key={index}>
                        <p style={{fontSize:"20px",paddingBottom:"10px"}}>
                        <Link to={`/meeting`} style={{color:"dodgerblue"}}>
                        <LeftCircleFilled/>
                        </Link>
                        </p>
                        <p style={{fontSize:"24px", paddingBottom:"10px",fontWeight:"bold",color:"#3F3F3F"}}>{item.topic}</p>
                          <Space>
                            <p><CalendarOutlined /></p>
                            <p style={{fontSize:"16px",color:"#3F3F3F"}}>{dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A")}</p>
                            <br></br>
                            <p><ClockCircleOutlined /></p>
                            {
                              dataVideo.map((item:any,index:any) => {
                                return(
                                  <div key={index}>                        
                                    <p style={{fontSize:"16px",color:"#3F3F3F"}}>{SecToTimeHMS(item.duration)}</p>
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
                      placeholder="Search text" 
                      onSearch={onSearch} 
                      enterButton
                      onChange={(e)=>{setKeyword(e.target.value)}} 
                    />
                    <Button type="primary" onClick={()=>setIsModalOpen(true)}>
                      <ExportOutlined style={{fontSize:"16px"}}/>
                      Export
                    </Button>
                      <Export 
                        ModalOpen={isModalOpen} 
                        setModalOpen={setIsModalOpen} 
                        video_id={dataVideo[0].video_id}
                        dataMeeting={dataMeetingEx}
                        dataAgenda={dataAgenda}
                        dataAgen={dataAgen}
                        dataVideo={dataVideo}
                      />
                  </Space>
                </Col>
              </Row>
              <Content style={{marginTop:"20px"}} >
                <Row>
                  <Col span={12} style={{paddingRight:"20px",paddingBottom:"35px"}}>
                    {/*
                    <div style={{paddingBottom:"10px"}}>
                    <p style={{fontSize:"16px",paddingBottom:"20px"}}>Follow</p>
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
                    */}
                    <CardTextArea setTab={setTab} file_extention={file_extention} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                  <Col span={12}>
                    <CardsAudioNoneTopic tab={tab} dataVideo={dataVideo} keyword={keyword} setContent={setContent} content={content} setFollow={setFollow} follow={follow}/>
                  </Col>
                </Row>
              </Content>
              <Footer style={{padding:"0px"}}>
                <audio 
                  id="audio"
                  style={{width:"100%",borderRadius:"8px"}}
                  controls preload="metadata" 
                > 
                  {
                    dataVideo.map((item:any,index:any) => {
                      return(                    
                        <source key={index} src={'http://localhost:13001/api/video/download?video_id='+ item.video_id} type="audio/wav"/>     
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