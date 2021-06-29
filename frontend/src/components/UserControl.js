import { Button, Menu } from "antd";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import LoginModal from "./modals/LoginModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import RecordModal from "./modals/RecordModal";
import {
  LOGIN_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  USER_RECORDS_QUERY,
} from "../graphql";

const UserControl = ({ user, setUser }) => {
  const { SubMenu } = Menu;

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const [cpModalVisible, setCpModalVisible] = useState(false);

  const [recordModalVisible, setRecordModalVisible] = useState(false);

  // const [records, setRecords] = useState([
  //   {
  //     date: "2021-06-20",
  //     part: "頭",
  //     level: 8,
  //     description: "智商不足", // not must
  //     injury: "沒救了",
  //     treatment: "皮諾可，這個直接電死",
  //   },
  // ]);

  const {
    loading,
    error,
    data: { queryUserRecords: records } = {},
    subscribeToMore,
  } = useQuery(USER_RECORDS_QUERY, {
    variables: { patientName: user ? user.username : "", auth: user },
  });

  const [currentRecord, setCurrentRecord] = useState({});

  const isLogin = (user) => {
    if (!user) return false;
    if (!user.username || user.username === "") return false;
    if (!user.identity || user.identity === "") return false;
    return true;
  };

  const [login] = useMutation(LOGIN_MUTATION);

  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION);

  const logout = () => {
    setUser(null);
  };

  return (
    <div>
      {isLogin(user) ? (
        <div>
          <div style={{ position: "absolute", width: "100%" }}>
            姓名：{user.username}
          </div>
          <Button
            style={{ position: "absolute", left: "33%", top: "6%" }}
            type="primary"
            onClick={logout}
          >
            登出
          </Button>
          <Menu
            mode="inline"
            style={{ position: "absolute", left: "0%", top: "13%" }}
          >
            <SubMenu key="user-information" title="帳戶資訊">
              <Menu.Item
                key="change-password"
                onClick={() => setCpModalVisible(true)}
              >
                更改密碼
              </Menu.Item>
            </SubMenu>
            {user.identity === "patient" && (
              <SubMenu
                key="my-record"
                title="我的病歷"
                onTitleClick={() => {
                  console.log("fetch records");
                }}
              >
                {records &&
                  records.map((record) => (
                    <Menu.Item
                      key={record.date}
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
            onCreate={async (info) => {
              await changePassword({
                variables: { data: user, newPassword: info.newPassword },
              });
              setCpModalVisible(false);
              logout();
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
            onCreate={async (user) => {
              const userReturn = await login({ variables: { data: user } });
              // console.log(userReturn.data.login);
              setUser(user);
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
