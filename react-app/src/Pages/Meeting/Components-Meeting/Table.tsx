import {useEffect,useState} from 'react';
import '../../../index.css';
import { Table,Popconfirm } from 'antd';
import axios from "axios"
import {
  DeleteOutlined
} from "@ant-design/icons"

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
    title: 'Date',
    dataIndex: 'meetdate',
    key: 'meetdate',
  },
  {
    title: 'Time',
    dataIndex: 'meettime',
    key: 'meettime',
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
    loadData()
  }, [])

  const loadData = async () => {

    await axios.get('http://localhost:13001/api/meeting/list')
    .then((response)=>{
      setMeetList(response.data.result.map((item:any,index:any) => 
        ({
          key:index,topic:item.topic,meettype:item.meettype,meetdate:item.meetdate,meettime:item.meettime,
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
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  const handleDelete =  async (meeting_id:any) => {
    
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://localhost:13001/api/meeting/delete',
      data : {meeting_id:meeting_id}
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