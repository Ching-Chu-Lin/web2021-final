import { Button, Menu } from "antd";
import { useState } from "react";
import LoginModal from "./modals/LoginModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import RecordModal from "./modals/RecordModal";

const UserControl = ({ user, setUser }) => {
  const { SubMenu } = Menu;

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const [cpModalVisible, setCpModalVisible] = useState(false);

  const [recordModalVisible, setRecordModalVisible] = useState(false);

  const [records, setRecords] = useState([
    {
      date: "2021-06-20",
      part: "頭",
      level: 8.7,
      description: "智商不足",
      injury: "沒救了",
      treatment: "皮諾可，這個直接電死",
    },
  ]);

  // TODO: receive new records from subscription

  const [currentRecord, setCurrentRecord] = useState({});

  const isLogin = (user) => {
    if (!user.name || user.name === "") return false;
    if (!user.identity || user.identity === "") return false;
    return true;
  };

  const login = (user) => {
    console.log(user);
    // TODO: ask backend
    setUser(user);
  };

  const logout = () => {
    setUser({});
  };

  const changePassword = (info) => {
    console.log(info);
    // TODO: ask backend
    logout();
  };

  return (
    <div>
      {isLogin(user) ? (
        <div>
          <div style={{position: "absolute", width: "100%" }}>姓名：{user.name}</div>
          <Button style={{position: "absolute", left: "33%", top: "6%"}} type="primary" onClick={logout}>
            登出
          </Button>
          <Menu mode="inline" style={{position: "absolute", left: "0%", top: "13%"}}>
            <SubMenu key="user-information" title="帳戶資訊">
              <Menu.Item
                key="change-password"
                onClick={() => setCpModalVisible(true)}
              >
                更改密碼
              </Menu.Item>
            </SubMenu>
            {user.identity === "team" && (
              <SubMenu
                key="my-record"
                title="我的病歷"
                onTitleClick={() => {
                  console.log("fetch records");
                }}
              >
                {records.map((record) => (
                  <Menu.Item
                    key="record.date"
                    onClick={() => {
                      setCurrentRecord(record);
                      setRecordModalVisible(true);
                    }}
                  >
                    {record.date}
                  </Menu.Item>
                ))}
              </SubMenu>
            )}
          </Menu>
          <ChangePasswordModal
            visible={cpModalVisible}
            user={user}
            onCreate={(info) => {
              changePassword(info);
              setCpModalVisible(false);
            }}
            onCancel={() => {
              setCpModalVisible(false);
            }}
          />
          <RecordModal
            visible={recordModalVisible}
            record={currentRecord}
            mode="view"
            onCancel={() => {
              setRecordModalVisible(false);
            }}
          />
        </div>
      ) : (
        <>
          <Button
            type="primary"
            onClick={() => {
              setLoginModalVisible(true);
            }}
          >
            登入
          </Button>
          <LoginModal
            visible={loginModalVisible}
            onCreate={(user) => {
              login(user);
              setLoginModalVisible(false);
            }}
            onCancel={() => {
              setLoginModalVisible(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default UserControl;
