import {FC} from "react";
import './../index.css';
import {
    DeleteOutlined,
    VideoCameraOutlined,
    PlusSquareOutlined
  } from '@ant-design/icons';
import { Layout, Menu} from 'antd';
import { Route,Routes,useNavigate, } from "react-router-dom";

//Components
import Import from "../Pages/Import/Import";
import Meeting from "../Pages/Meeting/Meeting";
import Trash from "../Pages/Trash/Trash";

const PageContent:FC = () =>{
  return(

    <Routes>
      <Route path="/" Component={Meeting}></Route>
      <Route path="/import" Component={Import}></Route>
      <Route path="/trash" Component={Trash}></Route>
    </Routes>
  )
}

const Navmenu: FC = () => {
  
  const { Sider,Content} = Layout
  const navigate = useNavigate()

    return (
      <>
      <Layout>
        <Sider className="App-sider">
          <div className="logo"></div>
          <Menu className="menu"
            theme="dark"
            mode="inline"
            onClick={({key}) => {{
              navigate(key)
            }}}
            items={[
              {
                key: '/import',
                icon: <PlusSquareOutlined />,
                label: 'Create Meetings',
              },
              {
                key: '/',
                icon: <VideoCameraOutlined />,
                label: 'Meetings',
              },
              {
                key: '/trash',
                icon: <DeleteOutlined />,
                label: 'Trash',
              },
            ]}
          />
        </Sider>
        <Content>
          <PageContent/>
        </Content>
      </Layout>
      </>
    );
};

export default Navmenu