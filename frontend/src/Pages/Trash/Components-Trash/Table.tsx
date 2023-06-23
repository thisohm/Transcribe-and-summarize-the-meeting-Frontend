import {useEffect,useState} from 'react';
import '../../../index.css';
import { Table,Popconfirm,Space } from 'antd';
import axios from "axios"
import {
  DeleteOutlined,
  UndoOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"
import { Link } from 'react-router-dom';

const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: 250
    },
    {
      title: 'Type of Meeting',
      dataIndex: 'meettype',
      key: 'meettype',
      width: 250
    },
    {
      title: 'Created',
      dataIndex: 'created_timestamp',
      key: 'created_timestamp',
      width: 250
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 250
    }
]

const TrashTable = () => {

    const [trashList,setTrashList] = useState([])

    useEffect(() => {
      loadDataTrash()
    }, [])
  
    const loadDataTrash = async () => {
  
      let endpoints = [
        'http://localhost:13001/api/meeting/list-trash',
      ]
  
      await axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(axios.spread(({...meeting}) => {
        setTrashList(meeting.data.result.map((item:any,index:any) => 
          ({
            key:index,topic:<Link to={`/meeting/${item.meeting_id}`}>{item.topic}</Link>,meettype:item.meettype,
            created_timestamp:dayjs(item.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A"),
            action:
            <Space size={'middle'}>
              <Popconfirm
                title="Recover the meeting"
                description="Are you sure to recover this meeting ?"
                okText="Yes"
                cancelText="No"
                onConfirm={()=>handleRecover(item.meeting_id)}
              >
                <UndoOutlined style={{color:"dodgerblue"}} />
              </Popconfirm>
              <Popconfirm
                title="Delete permanently the meeting"
                description="Are you sure to delete permanently this meeting ?"
                okText="Yes"
                cancelText="No"
                onConfirm={()=>handleDelete(item.meeting_id)}
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
    
    const handleRecover =async (meeting_id:any) => {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/meeting/recover-to-meet',
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
      localStorage.removeItem(String(meeting_id+'follow'))
      localStorage.removeItem(String(meeting_id+'content'))
      window.location.reload()
    }

  return (
    <>
      <Table style={{padding:"10px",margin:"auto"}}  columns={columns} dataSource={trashList} />
    </>
  )
}

export default TrashTable