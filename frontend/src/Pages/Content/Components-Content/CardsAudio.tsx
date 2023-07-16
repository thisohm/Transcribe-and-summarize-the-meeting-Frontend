import React,{useState,useEffect} from 'react'
import { Card,List } from "antd"
import { useParams } from 'react-router-dom'
import axios from 'axios'

const CardsAudio = ({dataMeeting,dataAgen}:any) => {
    const { meeting_id } = useParams()
    const [activeTabKey1, setActiveTabKey1] = useState<string>('0');
    const [dataAgenda,setDataAgenda] = useState([])
    const [dataSub,setDataSub] = useState([])
    const [loadMain,setloadMain] = useState(false)
  
    const onTab1Change = (key: string) => {
      setActiveTabKey1(key);
    };

    useEffect(()=>{
      loadDataAgenda(meeting_id)
      loadDataVideo(meeting_id)
    },[])

    useEffect(()=>{
      setDataAgenda(current => [dataAgenda[0],...current])
    },[loadMain])

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
        setloadMain(true)
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
        loadDataSub(response.data.result[0].video_id)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    const loadDataSub = async (video_id:any) => {

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/subtitle/content',
        data: {video_id:video_id}
        }
      
        await axios.request(config)
        .then((response) => {
          setDataSub(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
      }

    const contentList: Record<any, React.ReactNode> = {
    0:
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
          
       item.start_time >= "0" && item.start_time < Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
        <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
            <List.Item>
              <div>
                {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
              </div>
            </List.Item>
            <List.Item>
              <div>
                {item.text}
              </div>
            </List.Item>
          </List.Item>
        :null
        )}
      >
      </List>,
    1:
      dataAgen.length > '1' ?
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
        item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        && item.start_time < Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
        <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
            <List.Item>
              <div>
                {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
              </div>
            </List.Item>
            <List.Item>
              <div>
                {item.text}
              </div>
            </List.Item>
          </List.Item>
        :null
        )}
      >
      </List>
      :
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
        item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
        <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
            <List.Item>
              <div>
                {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
              </div>
            </List.Item>
            <List.Item>
              <div>
                {item.text}
              </div>
            </List.Item>
          </List.Item>
        :null
        )}
      >
      </List>,
    2:
      dataAgen.length > '2' ?
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
        item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        && item.start_time < Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
        <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
            <List.Item>
              <div>
                {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
              </div>
            </List.Item>
            <List.Item>
              <div>
                {item.text}
              </div>
            </List.Item>
          </List.Item>
        :null
        )}
      >
      </List>
      :
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
        item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
        <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
            <List.Item>
              <div>
                {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
              </div>
            </List.Item>
            <List.Item>
              <div>
                {item.text}
              </div>
            </List.Item>
          </List.Item>
        :null
        )}
      >
      </List>,
    3:
      dataAgen.length > '3' ?
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
        item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        && item.start_time < Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
        <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
            <List.Item>
              <div>
                {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
              </div>
            </List.Item>
            <List.Item>
              <div>
                {item.text}
              </div>
            </List.Item>
          </List.Item>
        :null
        )}
      >
      </List>
      : 
      <List
      grid={{ gutter:16, column: 1}}
      dataSource={dataSub}
      renderItem={(item:any, i) => (
      item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
          <List.Item>
            <div>
              {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
            </div>
          </List.Item>
          <List.Item>
            <div>
              {item.text}
            </div>
          </List.Item>
        </List.Item>
      :null
      )}
    >
    </List>,
    4:
      dataAgen.length > '4' ?
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
        item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        && item.start_time < Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
        <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
            <List.Item>
              <div>
                {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
              </div>
            </List.Item>
            <List.Item>
              <div>
                {item.text}
              </div>
            </List.Item>
          </List.Item>
        :null
        )}
      >
      </List>
      : 
      <List
      grid={{ gutter:16, column: 1}}
      dataSource={dataSub}
      renderItem={(item:any, i) => (
      item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
          <List.Item>
            <div>
              {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
            </div>
          </List.Item>
          <List.Item>
            <div>
              {item.text}
            </div>
          </List.Item>
        </List.Item>
      :null
      )}
    >
    </List>,
    5:dataAgen.length > '4' ?
    <List
      grid={{ gutter:16, column: 1}}
      dataSource={dataSub}
      renderItem={(item:any, i) => (
      item.start_time >= Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
      <List.Item style={{border:"1px solid lightgray",borderRadius:"10px"}}>
          <List.Item>
            <div>
              {SecToTimeHMS(item.start_time)} - {SecToTimeHMS(item.end_time)} 
            </div>
          </List.Item>
          <List.Item>
            <div>
              {item.text}
            </div>
          </List.Item>
        </List.Item>
      :null
      )}
    >
    </List>
    : null
  }

  return (
    <>
      <p style={{fontSize:"16px",paddingBottom:"10px"}}>Transcript</p>
      <Card
        style={{border:"1px solid gainsboro",borderRadius:"10px"}}
        extra=""
        tabList={
          dataAgenda.map((item:any,index:any) => (            
            (index==0) ? {
              key:index,
              tab:'Main'
            }
            :
            {
              key:index,
              tab:item.agentopic
            }
          ))
        } 
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        <div
            id="scrollableDiv"
            style={{
              height: 615,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '0 10px'
            }}>
          {contentList[activeTabKey1]}
        </div>
      </Card>

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

//Change hh:mm:ss.ms to seconds
function TimeCodeToSeconds(value:any) {
    let [hours, minutes, seconds] = value.split(':');
    
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

export default CardsAudio