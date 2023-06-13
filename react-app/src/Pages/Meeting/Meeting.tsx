import {FC} from 'react'
import './../../index.css';
import Table from './Components-Meeting/Table';

const Meeting: FC = () => {
    return(
        <>
            <p style={{padding:"15px"}}>Meeting</p> 
            <div style={{padding:"50px",margin:"auto",width:"auto"}}>
            <Table/>
            </div>
        </>
    )
}

export default Meeting