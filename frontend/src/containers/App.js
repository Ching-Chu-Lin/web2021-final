import "./App.css";
import { useState } from "react";
import { Layout, message } from "antd";
import Calendar from "../components/Calendar";
import Title from "../components/Title";
import UserControl from "../components/UserControl";
import AuthContext from "../context/AuthContext";
import DisplayContext from "../context/DisplayContext";

const App = () => {
  const { Header, Sider, Content } = Layout;
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const displayStatus = (payload) => {
    if (payload.msg) {
      const { type, msg } = payload;
      const content = { content: msg, duration: 1.5 };
      switch (type) {
        case "success":
          message.success(content);
          break;
        case "error":
          message.error(content);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="App">
      <AuthContext.Provider value={[token, setToken]}>
        <DisplayContext.Provider value={{ displayStatus }}>
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
        </DisplayContext.Provider>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
