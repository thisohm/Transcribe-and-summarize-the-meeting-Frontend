import {useEffect,useState} from 'react'
import axios from 'axios';
import {Modal,Input , Select, Form} from 'antd'
import { saveAs } from "file-saver";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { useParams } from 'react-router-dom';
import dayjs from "dayjs"

const Export = ({ModalOpen,setModalOpen,video_id,dataMeeting,dataAgenda,dataAgen,dataVideo}:any) => {
    const {meeting_id} = useParams()
    const [dataSub,setDataSub]:any[] = useState([])
    const [fileName,setFileName] = useState<String>("")
    const [fileType,setFileType] = useState<String>("")
    const [ok,setOk] = useState(true)

    useEffect(()=>{
        loadDataSub(video_id)
    },[])

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
                    text: "Topic : " + dataMeeting?.topic,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Date&time : " + dayjs(dataMeeting?.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A"),
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Duration : " + SecToTimeHMS(dataVideo[0].duration),
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Type of meeting : " + dataMeeting?.meettype,
                    heading: HeadingLevel.HEADING_1,
                }),
                
                new Paragraph(
                     (dataMeeting?.location!= "" && dataMeeting?.meetapp == "")

                    ?
                    {
                        text: "Location : " + dataMeeting?.location,
                        heading: HeadingLevel.HEADING_1,
                    }
                    :
                    {
                        text: "Application : " + dataMeeting?.meetapp,
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
                    text: "Topic : " + dataMeeting?.topic,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Date&time : " + dayjs(dataMeeting?.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A"),
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Duration : " + SecToTimeHMS(dataVideo[0].duration),
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    text: "Type of meeting : " + dataMeeting?.meettype,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph(
                    (dataMeeting?.location != "" && dataMeeting?.meetapp=="")
                    ?
                    {
                        text: "Location : " + dataMeeting?.location,
                        heading: HeadingLevel.HEADING_1,
                    }
                    :
                    {
                        text: "Application : " + dataMeeting?.meetapp,
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
                            TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
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
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
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
                    (dataAgen.length == 1)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
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
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
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
                    (dataAgen.length == 2)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
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
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
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
                    (dataAgen.length == 3)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
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
                                    TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                                &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
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
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
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
                    (dataAgen.length == 5)?
                    {
                        children: [
                            ...dataSub.map((item:any)=>{
                                if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))) 
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
   
    //export txt
    const txt = 
        (dataAgenda==false? 
            "Topic : " + dataMeeting?.topic + "\n" +
            "Date&time : " + dayjs(dataMeeting?.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A") + "\n" +
            "Duration : " + SecToTimeHMS(dataVideo[0].duration) + "\n" +
            "Type of meeting : " + dataMeeting?.meettype + "\n" +
            (dataMeeting?.location != "" && dataMeeting?.meetapp=="" ? "Location : " + dataMeeting?.location : "Application : " + dataMeeting?.meetapp) + "\n" + "\n" +
            "Transcript" + "\n" + "\n" +
            dataSub.map((item:any,i:any)=>{
                if(i%10==0){
                    return(
                        item.text + "\n"
                    )
                }
                else{
                    return(
                        item.text
                    )
                }
            }).join('') + "\n" + "\n" +
            "Follow" + "\n" + 
            JSON.parse(String(localStorage.getItem(meeting_id+"follow"))) + "\n" + "\n" +
            "Content" + "\n" + 
            JSON.parse(String(localStorage.getItem(meeting_id+"content")))
        :
            "Topic : " + dataMeeting?.topic + "\n" +
            "Date&time : " + dayjs(dataMeeting?.created_timestamp).format("ddd, MMM D, YYYY HH:mm:ss A") + "\n" +
            "Duration : " + SecToTimeHMS(dataVideo[0].duration) + "\n" +
            "Type of meeting : " + dataMeeting?.meettype + "\n" +
            (dataMeeting?.location != "" && dataMeeting?.meetapp=="" ? "Location : " + dataMeeting?.location : "Application : " + dataMeeting?.meetapp) + "\n" + "\n" +
            "Transcript" + "\n" + "\n" +
            "Main" + "\n" +
            dataSub.map((item:any,i:any)=>{
                if(TimeCodeToSeconds(item.start_time) >= 0 && 
                TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
                {
                    if(i%10==0){
                        return(
                            item.text + "\n"
                        )
                    }
                    else{
                        return(
                            item.text
                        )
                    }
                }
            }).join('')
            + "\n" + "\n" +
            (dataAgen.length > 0 ? dataAgen[0].agentopic :"") + "\n" +
            (dataAgen.length>1 ?
                dataSub.map((item:any,i:any)=>{
                    if(
                        TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                    &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
                    )
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :
            (dataAgen.length==1 ?
                dataSub.map((item:any,i:any)=>{
                    if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[0].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :""))
            + "\n" + "\n" +
            (dataAgen.length > 1 ? dataAgen[1].agentopic :"") + "\n" +
            (dataAgen.length>2 ?
                dataSub.map((item:any,i:any)=>{
                    if(
                        TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                    &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
                    )
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :
            (dataAgen.length==2 ?
                dataSub.map((item:any,i:any)=>{
                    if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[1].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :""))
            + "\n" + "\n" +
            (dataAgen.length > 2 ? dataAgen[2].agentopic :"") + "\n" +
            (dataAgen.length>3 ?
                dataSub.map((item:any,i:any)=>{
                    if(
                        TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                    &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
                    )
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :
            (dataAgen.length==3 ?
                dataSub.map((item:any,i:any)=>{
                    if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[2].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :""))
            + "\n" + "\n" +
            (dataAgen.length > 3 ? dataAgen[3].agentopic :"") + "\n" +
            (dataAgen.length>4 ?
                dataSub.map((item:any,i:any)=>{
                    if(
                        TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)) 
                    &&  TimeCodeToSeconds(item.start_time) < Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting?.meettime))
                    )
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :
            (dataAgen.length==4 ?
                dataSub.map((item:any,i:any)=>{
                    if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[3].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :""))
            + "\n" + "\n" +
            (dataAgen.length > 4 ? dataAgen[4].agentopic :"") + "\n" +
            (dataAgen.length==5 ?
                dataSub.map((item:any,i:any)=>{
                    if(TimeCodeToSeconds(item.start_time) >= Math.abs(TimeCodeToSeconds(dataAgen[4].agentime)-TimeCodeToSeconds(dataMeeting?.meettime)))
                    {
                        if(i%10==0){
                            return(
                                item.text + "\n"
                            )
                        }
                        else{
                            return(
                                item.text
                            )
                        }
                    }
                }).join('')
            :"") + "\n" + "\n" +
            "Follow" + "\n" + 
            JSON.parse(String(localStorage.getItem(meeting_id+"follow"))) + "\n" + "\n" +
            "Content" + "\n" + 
            JSON.parse(String(localStorage.getItem(meeting_id+"content")))
        )         
        
    const exportFile = (fileType:String) => {
        if(fileType==="docx")
        {
            Packer.toBlob(doc).then((blob) => {
            saveAs(blob, fileName+".docx");
            });
        }
        if(fileType==="txt")
        {
            var blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
            saveAs(blob, fileName+".txt");
        
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
                        { value: 'txt', label: '.txt' },
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

//Change seconds to hh:mm:ss
function SecToTimeHMS(timeInSeconds:any) {
    var pad = function(num:any, size:any) { return ('000' + num).slice(size * -1); },
    time:any = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60)
    
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
    
  }

export default Export