import { Button, Menu } from "antd";
import { useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import LoginModal from "./modals/LoginModal";
import ChangeUsernameModal from "./modals/ChangeUsernameModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import RecordModal from "./modals/RecordModal";
import CreateUserModal from "./modals/CreateUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";
import OpendayModal from "./modals/OpendayModal";
import {
  USER_RECORDS_QUERY,
  LOGIN_MUTATION,
  CREATE_USER_MUTATION,
  DELETE_USER_MUTATION,
  CHANGE_USERNAME_MUTATION,
  CHANGE_PASSWORD_MUTATION,
} from "../graphql";

const UserControl = ({ user, setUser }) => {
  const { SubMenu } = Menu;

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const [cnameModalVisible, setCnameModalVisible] = useState(false);

  const [cpModalVisible, setCpModalVisible] = useState(false);

  const [recordModalVisible, setRecordModalVisible] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [opendayModalVisible, setOpendayModalVisible] = useState(false);

  // const {
  //   loading,
  //   error,
  //   data: { queryUserRecords: records } = {},
  //   subscribeToMore,
  // } = useQuery(USER_RECORDS_QUERY, {
  //   variables: { patientName: user ? user.username : "", auth: user },
  // });

  const [
    getRecord,
    { loading, error, data: { queryUserRecords: records } = {} },
  ] = useLazyQuery(USER_RECORDS_QUERY);

  const [currentRecord, setCurrentRecord] = useState({});

  const isLogin = (user) => {
    if (!user) return false;
    if (!user.username || user.username === "") return false;
    if (!user.identity || user.identity === "") return false;
    return true;
  };

  const [login] = useMutation(LOGIN_MUTATION);

  const [changeUsername] = useMutation(CHANGE_USERNAME_MUTATION);

  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION);

  const [createUser] = useMutation(CREATE_USER_MUTATION);

  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

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
              {!user.username === "admin" && (
                <>
                  <Menu.Item
                    key="change-username"
                    onClick={() => setCnameModalVisible(true)}
                  >
                    更改姓名
                  </Menu.Item>
                  <ChangeUsernameModal
                    visible={cnameModalVisible}
                    user={user}
                    onCreate={async (info) => {
                      await changeUsername({
                        variables: {
                          data: user,
                          newUsername: info.newUsername,
                        },
                      });
                      setCnameModalVisible(false);
                      logout();
                    }}
                    onCancel={() => setCnameModalVisible(false)}
                  />
                </>
              )}
              <Menu.Item
                key="change-password"
                onClick={() => setCpModalVisible(true)}
              >
                更改密碼
              </Menu.Item>
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
                onCancel={() => setCpModalVisible(false)}
              />
            </SubMenu>
            {user.identity === "patient" && (
              <SubMenu
                key="my-record"
                title="我的病歷"
                onTitleClick={async () => {
                  await getRecord({
                    variables: { patientName: user.username, auth: user },
                  });
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
                <RecordModal
                  visible={recordModalVisible}
                  record={currentRecord}
                  mode="view"
                  onCancel={() => setRecordModalVisible(false)}
                />
              </SubMenu>
            )}
            {user.username === "admin" && (
              <SubMenu key="admin" title="管理">
                <Menu.Item
                  key="create-user"
                  onClick={() => setCreateModalVisible(true)}
                >
                  新增使用者
                </Menu.Item>
                <CreateUserModal
                  visible={createModalVisible}
                  identity={user.identity}
                  onCreate={async (user) => {
                    await createUser({
                      variables: { date: user },
                    });
                    setCreateModalVisible(false);
                  }}
                  onCancel={() => setCreateModalVisible(false)}
                />
                <Menu.Item
                  key="delete-user"
                  onClick={() => setDeleteModalVisible(true)}
                >
                  刪除使用者
                </Menu.Item>
                <DeleteUserModal
                  visible={deleteModalVisible}
                  identity={user.identity}
                  onCreate={async (username) => {
                    await createUser({
                      variables: { username },
                    });
                    setDeleteModalVisible(false);
                  }}
                  onCancel={() => setDeleteModalVisible(false)}
                />
                {user.identity === "doctor" && (
                  <>
                    <Menu.Item
                      key="openday"
                      onClick={() => setOpendayModalVisible(true)}
                    >
                      服務時間
                    </Menu.Item>
                    <OpendayModal
                      visible={opendayModalVisible}
                      onCancel={() => setOpendayModalVisible(false)}
                    />
                  </>
                )}
              </SubMenu>
            )}
          </Menu>
        </div>
      ) : (
        <>
          <Button
            type="primary"
            style={{borderRadius: "5px"}}
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
