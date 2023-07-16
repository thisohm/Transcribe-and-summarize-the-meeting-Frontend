import {useEffect,useState} from 'react';
import './index.css'
import { Table,Popconfirm, Space } from 'antd';
import axios from "axios"
import {
  DeleteOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"
import { useNavigate } from 'react-router-dom';



const DataTable = () => {

  const [meetList,setMeetList] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    loadDataMeeting()
  }, [])

  const columns = [
  
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: 250,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Type of Meeting',
      dataIndex: 'meettype',
      key: 'meettype',
      width: 250,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Created',
      dataIndex: 'created_timestamp',
      key: 'created_timestamp',
      width: 250,
      onCell:(record:any) => {
        return {
            onClick: () => {   
              navigate(`/meeting/${record.meeting_id}`)
            }
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 250
    }
  ]
  
  const loadDataMeeting = async () => {
    
    let endpoints = [
      'http://localhost:13001/api/meeting/list',
    ]

    await axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
    .then(axios.spread(({...meeting}) => {
      setMeetList(meeting.data.result.map((item:any,index:any) => 
        ({
          key:index,meeting_id:item.meeting_id,topic:item.topic,meettype:item.meettype,
          created_timestamp:dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A"),
          action:
          <Space size={'middle'}>
            <br></br>
            <Popconfirm
              title="Move the meeting to trash"
              description="Are you sure to move this meeting  to trash?"
              okText="Yes"
              cancelText="No"
              onConfirm={()=>moveToTrash(item.meeting_id)}
            >
              <DeleteOutlined style={{color:"red"}} />
            </Popconfirm>
          </Space>
        })
      ))
    }))
    .catch((error) => {
      console.log(error)
    })

  }

  const moveToTrash =  async (meeting_id:any) => {
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/meeting/move-to-trash',
      data: {meeting_id:meeting_id}
    }
    
    await axios.request(config)
    .then((response)=>{
      console.log(response.data.message)
    })
    .catch((error)=>{
      console.log(error)
    })

    window.location.reload()
  }

  return(
    <>
      <Table
        rowClassName='row'
        style={{padding:"10px",margin:"auto"}}  
        columns={columns}
        dataSource={meetList} />
    </>
  )
}

export default DataTable;