import {useEffect,useState} from 'react'
import axios from 'axios';
import {Modal,Input , Select, Form} from 'antd'
import { saveAs } from "file-saver";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { useParams } from 'react-router-dom';

const Export = ({ModalOpen,setModalOpen,topic,datetime,duration,meettime,typeOfMeet,location,meetapp,video_id,dataAgenda}:any) => {
    const {meeting_id} = useParams()
    const [dataSub,setDataSub]:any[] = useState([])
    const [dataAgen,setDataAgen]:any[] = useState([])
    const [fileName,setFileName] = useState<String>("")
    const [fileType,setFileType] = useState<String>("")
    const [ok,setOk] = useState(true)
    
    useEffect(()=>{
        loadDataAgenda(meeting_id)
        loadDataSub(video_id)
    },[])

    const loadDataAgenda = async (meeting_id:any) => {
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:13001/api/meeting/meet-id-list',
            data: {meeting_id:meeting_id}
        }
      
        await axios.request(config)
        .then((response) => {
          setDataAgen(response.data.agenda)
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
   
    // export docx
    const doc = new Document({
    styles: {
        default: {
            heading1: {
                run: {
                    size: 28,
                    font: "Calibri",
                    bold: true,
                    color: "000000",
                },
                paragraph: {
                    spacing: {
                        after: 120,
                    },
                },
            },
            heading2: {
                run: {
                    size: 28,
                    font: "Calibri",
                    bold: true,
                    color: "000000",
                },
                paragraph: {
                    spacing: {
                        before: 240,
                        after: 120,
                    },
                },
            },
            heading3: {
                run: {
                    size: 24,
                    font: "Calibri",
                    bold: true,
                    color: "000000",
                },
                paragraph: {
                    spacing: {
                        before: 240,
                        after: 120,
                    },
                },
            },
            listParagraph: {
                run: {
                    color: "000000",
                },
            },
            document: {
                run: {
                    size: 24,
                    font: "Calibri",
                },
                paragraph: {
                    alignment: AlignmentType.LEFT,
                },
            },
        },
    },
    sections: [
        {
            children: 
            (dataAgenda==false)?
            [    
                new Paragraph({
                    text: "Topic : " + topic,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Date&time : " + datetime,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Duration : " + duration,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Type of meeting : " + typeOfMeet,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph(
                    (location.length>0 && meetapp.length==0)
                    ?
                    {
                        text: "location : " + location,
                        heading: HeadingLevel.HEADING_1,
                    }
                    :
                    {
                        text: "Application : " + meetapp,
                        heading: HeadingLevel.HEADING_1,
                    }
                ),
                new Paragraph({
                    text: "Transcript",
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                    children: [
                        ...dataSub.map((item:any)=>{
                            return(
                                new TextRun({
                                    text: item.text
                                })
                            )
                        })
                    ],
                }),
            ]
            :
            [    
                new Paragraph({
                    text: "Topic : " + topic,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Date&time : " + datetime,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Duration : " + duration,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Type of meeting : " + typeOfMeet,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph(
                    (location.length>0 && meetapp.length==0)
                    ?
                    {
                        text: "location : " + location,
                        heading: HeadingLevel.HEADING_1,
                    }
                    :
                    {
                        text: "Application : " + meetapp,
                        heading: HeadingLevel.HEADING_1,
                    }
                ),
                new Paragraph({
                    text: "Transcript",
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                    text: "Main",
                    heading: HeadingLevel.HEADING_3
                }),
                new Paragraph(
                    {
                    children: [
                        ...dataSub.map((item:any)=>{
                            if(TimeCodeToSeconds(item.start_time) >= 0 && 
                            TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(meettime)))
                            {
                                return(
                                    new TextRun({
                                        text: item.text
                                    })
                                )
                            }
                        })
                    ],
                    }
                ),
                //agenda topic 1
                new Paragraph(
                    (dataAgen.length > 0)
                    ?
                    {
                    text: dataAgen[0].agentopic,
                    heading: HeadingLevel.HEADING_3
                    }
                    :{}
                ),
                new Paragraph(
                    (dataAgen.length > 1)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(meettime))
                                )
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :
                    (dataAgen.length = 1)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(meettime)))
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :{}     
                ),
                //agenda topic 2
                new Paragraph(
                    (dataAgen.length > 1)
                    ?
                    {
                    text: dataAgen[1].agentopic,
                    heading: HeadingLevel.HEADING_3
                    }
                    :{}
                ),
                new Paragraph(
                    (dataAgen.length > 2)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(meettime))
                                )
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :
                    (dataAgen.length = 2)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(meettime)))
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :{}     
                ),
                //agenda topic 3
                new Paragraph(
                    (dataAgen.length > 2)
                    ?
                    {
                    text: dataAgen[2].agentopic,
                    heading: HeadingLevel.HEADING_3
                    }
                    :{}
                ),
                new Paragraph(
                    (dataAgen.length > 3)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(meettime))
                                )
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :
                    (dataAgen.length = 3)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(meettime)))
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :{}     
                ),
                //agenda topic 4
                new Paragraph(
                    (dataAgen.length > 3)
                    ?
                    {
                    text: dataAgen[3].agentopic,
                    heading: HeadingLevel.HEADING_3
                    }
                    :{}
                ),
                new Paragraph(
                    (dataAgen.length > 4)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(meettime))
                                )
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :
                    (dataAgen.length > 4)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(meettime)))
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :{}     
                ),
                //agenda topic 5
                new Paragraph(
                    (dataAgen.length > 4)
                    ?
                    {
                    text: dataAgen[4].agentopic,
                    heading: HeadingLevel.HEADING_3
                    }
                    :{}
                ),
                new Paragraph(
                    (dataAgen.length = 5)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(meettime))) 
                                {
                                    return(                                        
                                        new TextRun({
                                            text: item.text
                                        })
                                    )
                                }
                            })
                        ],
                    }
                    :{}     
                ),
                new Paragraph({
                    text: "Follow",
                    heading: HeadingLevel.HEADING_3
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: JSON.parse(String(localStorage.getItem(meeting_id+"follow")))
                        })
                    ]
                }),
                new Paragraph({
                    text: "Content",
                    heading: HeadingLevel.HEADING_3
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: JSON.parse(String(localStorage.getItem(meeting_id+"content")))
                        })
                    ]
                })
            ],
        },
    ],
    });


    const exportFile = (fileType:String) => {
        if(fileType==="docx")
        {
            Packer.toBlob(doc).then((blob) => {
            saveAs(blob, fileName+".docx");
            });
        }
        if(fileType==="pdf")
        {     
            /*
            Packer.toBlob(doc).then((blob) => {
            const pdf = new Blob([blob],{type: "application/pdf;charset=utf-8"})
            saveAs(pdf, fileName+".pdf");
            });
            */  
        }
    }

    const handleOk = (fileType:String) => {
        exportFile(fileType)
        setModalOpen(false)
    }
    
    const handleCancel = () => {
        setModalOpen(false)
    }
    
    const onChangeFile = (e:any) =>{
        setFileName(e)
        handleError(e,fileType)
    }

    const handleSelect = (value:String) => {
        setFileType(value)
        handleError(fileName,value)
    }

    const handleError = (name:any,type:any) => {
        if(name.length < 1 || type.length < 1 ){
            setOk(true)
        }
        if(name.length > 0 && type.length > 0){
            setOk(false)
        }
    }

  return (
    <Modal bodyStyle={{height:"120px"}} title="Export file" open={ModalOpen} okButtonProps={{disabled:ok}} okText="Export" onOk={()=>handleOk(fileType)} onCancel={handleCancel}>
        <Form>
        <div style={{paddingTop:"10px"}}>
            <Form.Item> 
                <Input onChange={(e)=>onChangeFile(e.target.value)} placeholder="Input file name"/>
            </Form.Item>
            <Form.Item>
                <Select
                    onSelect={handleSelect}
                    placeholder="Select file type"
                    options={[
                        { value: 'docx', label: '.docx' },
                        { value: 'pdf', label: '.pdf' },
                    ]}
                >
                </Select>
            </Form.Item>
        </div>
        </Form>
    </Modal>
  )
}

//Change hh:mm:ss.ms to seconds
function TimeCodeToSeconds(value:any) {
    let [hours, minutes, seconds] = value.split(':');
  
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
}

export default Export