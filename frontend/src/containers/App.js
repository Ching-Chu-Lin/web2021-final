import "./App.css";
import { useState } from "react";
import { Layout } from "antd";
import Calendar from "../components/Calendar";
import Title from "../components/Title";
import UserControl from "../components/UserControl";

const App = () => {
  const { Header, Sider, Content } = Layout;
  const [user, setUser] = useState();
  return (
    <div className="App">
      <Layout>
        <Header style={{ backgroundColor: "white" }}>
          <Title />
        </Header>
        <Layout>
          <Sider theme="light">
            <UserControl user={user} setUser={setUser} />
          </Sider>
          <Content style={{ backgroundColor: "white" }}>
            <Calendar user={user} />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
