import {useEffect,useState} from 'react';
import '../../../index.css';
import { Table,Popconfirm } from 'antd';
import axios from "axios"
import {
  DeleteOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Topic',
    dataIndex: 'topic',
    key: 'topic',
  },
  {
    title: 'Type of Meeting',
    dataIndex: 'meettype',
    key: 'meettype',
  },
  {
    title: 'Created',
    dataIndex: 'created_timestamp',
    key: 'created_timestamp',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  }
]

const DataTable = () => {

  const [meetList,setMeetList] = useState([])

  useEffect(() => {
    loadDataMeeting()
  }, [])

  const loadDataMeeting = async () => {

    let endpoints = [
      'http://localhost:13001/api/meeting/list',
    ]

    await axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
    .then(axios.spread(({...meeting}) => {
      setMeetList(meeting.data.result.map((item:any,index:any) => 
        ({
          key:index,topic:<Link to={`/meeting/${item.meeting_id}`}>{item.topic}</Link>,meettype:item.meettype,
          created_timestamp:dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss a"),
          action:
          <Popconfirm
            title="Delete the meeting"
            description="Are you sure to delete this meeting ?"
            okText="Yes"
            cancelText="No"
            onConfirm={()=>handleDelete(item.meeting_id)}
          >
            <DeleteOutlined style={{color:"red"}} />
          </Popconfirm>
        })
      ))
    }))
    .catch((error) => {
      console.log(error)
    })

  }

  const handleDelete =  async (meeting_id:any) => {
    
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/meeting/delete',
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
      <Table style={{padding:"10px",margin:"auto"}}  columns={columns} dataSource={meetList} />
    </>
  )
}

export default DataTable;