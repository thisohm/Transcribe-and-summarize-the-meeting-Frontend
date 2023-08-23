import React,{useState,useEffect} from 'react'
import { Card,List,Dropdown,Menu,Row,Col,Button,Space, message } from "antd"
import { 
  EllipsisOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useAsyncError, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

const Cards = ({dataMeeting,dataAgen,dataVideo,keyword}:any) => {
    const video = document.getElementById("video") as HTMLVideoElement | null;
    const { meeting_id } = useParams()
    const [activeTabKey1, setActiveTabKey1] = useState<string>('0');
    const [isInputTag, setInputTag] = useState(true);
   
    const [loadMain,setloadMain] = useState(false)
    const [dataAgenda,setDataAgenda] = useState([])
    const [dataSub,setDataSub]:any[] = useState([])
    const [updateDataSub,setUpdateDataSub]:any[] = useState([])
    const [addNewSub, setAddNewSub]:any[] = useState([]);
    const [deleteSub, setDeleteSub]:any[] = useState([]);
    const [updateSubEdit, setUpdateSubEdit]:any[] = useState([]);

    const [subIdSelect, setSubIdSelect] = useState(null);
    const [timeSelect, setTimeSelect] = useState("")
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isError, setIndexUpdatesError] = useState(false);
    const [stateCreate, setStateCreate] = useState('');
    const [stateDelete, setStateDelete] = useState('');
    const [stateUpdate, setStateUpdate] = useState('1');
    const [textUpdate, setTextUpdate] = useState(false)
    const [indexUpdate, setIndexUpdate] = useState(0);
    const [dataEmpty, setDataEmpty] = useState(true);
    const [isId, setIsId] = useState('');
    const [cardHighlight,setCardHighLight] = useState(false)

    const Highlight = require('react-highlighter');

    const onTab1Change = (key: string) => {
      setActiveTabKey1(key);
    };

    useEffect(()=> {
      loadDataAgenda(meeting_id)
      loadDataVideo(meeting_id)
    },[])

    useEffect(()=>{
      setDataAgenda(current => [dataAgenda[0],...current])
    },[loadMain])

    useEffect(()=>{
      filterBySearch(keyword)
    },[keyword])
    
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
          setUpdateDataSub(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
      }

    const editContent = async (video_id:any,subdata:any) => {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:13001/api/subtitle/edit',
        data: {video_id:video_id,subtitleInfo:subdata}
        }
      
        await axios.request(config)
        .then((response) => {
          console.log("edit success")
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const checkEditandAdd = () => {
      addNewSub.forEach((item:any) => {
        if(item.sub_id === isId && item.text !== ''){
          setDataEmpty(true);   
        }
        if(item.sub_id === isId && item.text === ''){
          setDataEmpty(false); 
        }
      })
    }
    
    const checkAddandDelete = (id: any) => {
      addNewSub.forEach((item:any) => {
        if(item.sub_id === id){
          const addNewSubUpdate = addNewSub.filter((item:any) => item.sub_id !== id)
          setAddNewSub(addNewSubUpdate)
          setDataEmpty(true)
        }
      })
    }
    
    const addSub = (index:any) => {
      const bendTime = dataSub.map((item:any) => item.end_time);
      const afTime = dataSub.map((item:any) => item.start_time);
      var addNewSubtitle
      
      if(dataEmpty == true){   
        if(indexUpdate == dataSub.length-1){
          addNewSubtitle = {
            text: '',
            start_time: bendTime[dataSub.length-1],
            end_time: bendTime[dataSub.length-1],
            sub_id: uuidv4(),
            mode: '0'
          }; 
        }else{
          addNewSubtitle = {
            text: '',
            start_time: bendTime[index],
            end_time: afTime[index+1],
            sub_id: uuidv4(),
            mode: '0'
          }; 
        }   
        setIndexUpdate(index+1)
        setAddNewSub([...addNewSub, addNewSubtitle]);   
        setStateCreate('0');          
        setDataSub([...dataSub.slice(0,index+1), addNewSubtitle, ...dataSub.slice(index+1)])
        setUpdateDataSub([...updateDataSub.slice(0,index+1), addNewSubtitle, ...updateDataSub.slice(index+1)])
        setIsId(addNewSubtitle.sub_id);   
      }

      if(addNewSubtitle?.text === ''){
        setDataEmpty(false)
      }
    }
    
    const  handleAddSub= async(index:any) => {
       addSub(index)
       setInputTag(false)
    };  
    
    const handleDeleteSub = (subId: any,text: any,startTime: any,endTime: any,index:any) => {
      const subDelete = {
                          text: text,
                          start_time:startTime,
                          end_time:endTime,
                          sub_id: subId,
                          mode: '2'
                        };
    setDeleteSub([...deleteSub,subDelete]);
    setStateDelete('2')
    checkAddandDelete(subId)

    const deleteSelect = dataSub.filter((item:any) => item.sub_id !== subId)
    setDataSub(deleteSelect);
    setUpdateDataSub(deleteSelect);
    setIndexUpdate(index)
  }

    const handleEditSub = (edit: any, sub_id: any, index:number, newEndTime:any, textSplit:any, text1:any) => {
      dataSub.map((item:any) => {
        if(item.sub_id === sub_id){
          if(textSplit === ''){
            item.text = edit
          }
          else{
            item.text = text1
            item.end_time = newEndTime
          }
          setStateUpdate('1')
          setIndexUpdate(index)
        }})
  
        if(edit !== ''){
          setTextUpdate(true)
        }
    }

    const handleupdateSubEdit = async (subedit: any, sub_id: any, startTime: any, endTime: any) => {
      const updateEdit = {
                            text: subedit,
                            start_time: startTime ,
                            end_time: endTime,
                            sub_id: sub_id,
                            mode: '1'
                          }
                          
          await setUpdateSubEdit([...updateSubEdit,updateEdit]);  
          setStateUpdate('1')
    }

    const pauseVDO = () => {
      if(video !== null) {
        video.pause()
      }
    }

    const getTime = (startTime: any, endTime: any) => {
      setIndexUpdatesError(false);
      setStartTime(startTime);
      setEndTime(endTime);
    }

    const handleChangeStartTime = (startTime: any, sub_id: any, text: any, endTime: any) => {
      let hourStart = parseInt(startTime.split(':')[0]) * 3600
      let minStart = parseInt(startTime.split(':')[1]) * 60
      let secStart = parseFloat(startTime.split(':')[2])
  
      let hourEnd = parseInt(endTime.split(':')[0]) * 3600
      let minEnd = parseInt(endTime.split(':')[1]) * 60
      let secEnd = parseFloat(endTime.split(':')[2])
  
      let totalStart = hourStart + minStart + secStart
      let totalEnd = hourEnd + minEnd + secEnd
  
      dataSub.map((item:any) => {
        if(item.sub_id === sub_id){
          let isError = false
          let dateFormat = /([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(:|\.)\d{3}/
          if(!dateFormat.test(startTime) /*|| totalStart > totalEnd */ || totalStart > dataVideo[0].duration){
            isError = true
          }
  
        item.start_time = startTime
        const subEdit = {
                          text: text,
                          start_time: item.start_time ,
                          end_time: endTime,
                          sub_id: sub_id,
                          mode: '1'
                        }
          setUpdateSubEdit([...updateSubEdit,subEdit]);
          setIndexUpdatesError(isError)
          setStateUpdate('1');
        }})
    }

    const handleChangeEndTime = (endTime: any, sub_id: any, text: any, startTime: any) => {
      let hourStart = parseInt(startTime.split(':')[0]) * 3600
      let minStart = parseInt(startTime.split(':')[1]) * 60
      let secStart = parseFloat(startTime.split(':')[2])
  
      let hourEnd = parseInt(endTime.split(':')[0]) * 3600
      let minEnd = parseInt(endTime.split(':')[1]) * 60
      let secEnd = parseFloat(endTime.split(':')[2])
  
      let totalStart = hourStart + minStart + secStart
      let totalEnd = hourEnd + minEnd + secEnd
  
      dataSub.map((item:any) => {
        if(item.sub_id === sub_id){
          let isError = false
          let dateFormat = /([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(:|\.)\d{3}/
          if(!dateFormat.test(endTime) /*|| totalEnd < totalStart*/ ||  totalEnd > dataVideo[0].duration){
            isError = true
          }
  
          item.end_time = endTime
          const subEdit = {
                            text: text,
                            start_time: startTime ,
                            end_time: item.end_time,
                            sub_id: sub_id,
                            mode: '1'
                          }
          setUpdateSubEdit([...updateSubEdit,subEdit]);
          setIndexUpdatesError(isError)
          setStateUpdate('1');
        }})
    }

    const handleBlurStart = (id: any, text: any, endTime:any) => {
      dataSub.map((item:any) => {
       if(isError && item.sub_id === id){
         item.start_time = startTime
         const subEdit = {
                            text: text,
                            start_time: item.start_time,
                            end_time: endTime,
                            sub_id: id,
                            mode: '1'
                          }
        setUpdateSubEdit([...updateSubEdit,subEdit]);
        setStateUpdate('1');
        setIndexUpdatesError(false)
       }
      })
     } 
  
     const handleBlurEnd = (id: any, text: any, timeStart :any) => {
      dataSub.map((item:any) => {
       if(isError && item.sub_id === id){
         item.end_time = endTime
         const subEdit = {
                            text: text,
                            start_time: timeStart,
                            end_time: item.end_time,
                            sub_id: id,
                            mode: '1'
                          }
        setUpdateSubEdit([...updateSubEdit,subEdit]);
        setStateUpdate('1');
        setIndexUpdatesError(false)
       }
      })
     }   

    const menuItemsSub = [
      {label: 'Edit',icon:<EditOutlined style={{color:"dodgerblue",fontSize:"14px"}}/>,key:'edit'},
      {label: 'Insert',icon:<PlusCircleOutlined style={{color:"dodgerblue",fontSize:"14px"}}/>, key: 'insert'},
      {label: 'Delete',icon:<CloseCircleOutlined style={{color:"red",fontSize:"14px"}} />, key: 'delete'},
    ];
  
    const menuSubDropdown = (
      <Menu selectedKeys={[]} items={menuItemsSub} onClick={(e) => {keyDropdownSub(e)}}/> 
    );
    
    const keyDropdownSub  = (e:any) => {
      switch(e.key) {
        case 'edit' : {
          setInputTag(false)
          if(isInputTag === false){
            setInputTag(true)
          }
        }
        break;
        case 'insert' :  {
          handleAddSub(indexUpdate)
          var textNew = document.getElementById("sub"+(+indexUpdate+1));
          if(textNew != null){
            textNew.focus();
          }
        } 
        break;
        case 'delete' : handleDeleteSub(dataSub[+indexUpdate].sub_id,dataSub[+indexUpdate].text,dataSub[+indexUpdate].start_time,dataSub[+indexUpdate].end_time,indexUpdate);
        break;
      }
    }

    const handleSave = async (e:any,video_id:any) => {
      let dateFormat = /([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(:|\.)\d{3}/
      if(stateCreate == '0'){
        const createsub =  await editContent(video_id,addNewSub) 
      }
      if(stateUpdate == '1'){
        let array = updateSubEdit;
        array.push(e);       
        const dataupdate = array.filter((item:any) => (dateFormat.test(item.start_time) && dateFormat.test(item.end_time)))
        const updatesub = await editContent(video_id,dataupdate)
      }
      if(stateDelete == '2'){
        const deletesub = await editContent(video_id,deleteSub)
      } 
      message.success("Save success")
      setTimeout(function(){
        window.location.reload();
     }, 1000);
    }

    const filterBySearch = (keyword:any) => {
      const query = keyword;
      var updatedList = [...updateDataSub];
      updatedList = updatedList.filter((item:any) => {
        return item.text.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1    
      })
      setDataSub(updatedList);
    };

  const contentList: Record<any, React.ReactNode> = {
    0:
      <List
        grid={{ gutter:16, column: 1}}
        dataSource={dataSub}
        renderItem={(item:any, i) => (
          
       TimeCodeToSeconds(item.start_time) >= 0 && TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
          TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
          TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
          TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
          TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
          TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
        TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                    <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
          TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) 
        &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime))? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
        TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
        TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting[0].meettime)) ? 
              <List.Item style={{border:(cardHighlight===true && indexUpdate === i && subIdSelect === item.sub_id) ? "1px solid dodgerblue" : "1px solid lightgray",borderRadius:"10px"}}
                onClick={()=>{pauseVDO()}}
                onFocus = {()=>{
                  setIndexUpdate(i)
                  setCardHighLight(true)
                  setSubIdSelect(item.sub_id)
                }}
              >
                <List.Item>
                    <Row justify={'space-between'}>
                      <Col>
                        <Space>
                          <input className='startTime'
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "true") ? "red" : "black"}} 
                            type='text' maxLength={12}
                            id = {"startTime"+item.sub_id} 
                            value = {item.start_time}
                            onChange={(e) => { 
                              handleChangeStartTime(e.target.value , item.sub_id, item.text, item.end_time)
                            }}
                            onFocus = { (e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("true")
                            }}
                            onBlur={() => {
                              handleBlurStart(item.sub_id, item.text, item.end_time)
                            }}
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />         
                          <div>-</div>
                          <input className='endTime'
                            type='text' maxLength={12}
                            id = {"endTime"+item.sub_id} 
                            style={{border:"none",width:"80px", color:(isError === true && subIdSelect === item.sub_id && timeSelect === "false") ? "red" : "black"}}
                            value = {item.end_time}
                            onChange={(e) => {
                              handleChangeEndTime(e.target.value , item.sub_id, item.text, item.start_time)
                            }}
                            onBlur={() => {
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                            }}
                            onFocus = {(e) => {
                              getTime( item.start_time, item.end_time)
                              setSubIdSelect(item.sub_id)
                              handleBlurEnd(item.sub_id, item.text, item.start_time)
                              setTimeSelect("false")
                            }} 
                            onClick={() => {
                              getTime( item.start_time, item.end_time)
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Dropdown placement="bottomRight" overlay={menuSubDropdown} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                      </Col>
                    </Row>      
                </List.Item>
                <List.Item>
                <div id="sub-text">
                  {isInputTag ? (
                      <Highlight style={{fontSize:"14px"}} onClick={() => {
                      setInputTag(false)
                      setCardHighLight(true)
                      setIndexUpdate(i)
                      setSubIdSelect(item.sub_id)
                    }} 
                    search={keyword} tye="text">{item.text}
                    </Highlight>
                   ) : (
                    <Row justify={'space-between'}>
                      <Col>
                        <input
                        style={{fontSize:"14px",border:"1px solid gainsboro",borderRadius:"5px",width:"400px"}}
                        type='text'
                        id={"sub"+i} 
                        value={item.text}
                        onChange={(e)=>{
                          handleEditSub(e.target.value,item.sub_id,i,'','','')
                          checkEditandAdd()
                          handleupdateSubEdit(e.target.value , item.sub_id, item.start_time, item.end_time)
                        }}
                        > 
                        </input>
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="small" onClick={() => setInputTag(true)}><CheckOutlined style={{fontSize:"12px"}}/></Button>
                      </Col>
                    </Row>
                    )}

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
      <Row justify={"space-between"} style={{fontSize:"16px",paddingBottom:"10px"}}>
        <Col>
        <p style={{fontSize:"16px"}}>Transcript</p>
        </Col>
        <Col>
          <Button 
            type='primary' 
            onClick={()=>{
              handleSave("",dataVideo[0].video_id)
            }}
          >
            <SaveOutlined />Save
          </Button>
        </Col>
      </Row>
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
              height: 400,
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

//Change hh:mm:ss.ms to seconds
function TimeCodeToSeconds(value:any) {
  let [hours, minutes, seconds] = value.split(':');

  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
}

export default Cards