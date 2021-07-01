import { Button, Menu, Spin } from "antd";
import { useState, useEffect, useContext } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import AuthContext from "../context/AuthContext";
import DisplayContext from "../context/DisplayContext";
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
  PATIENT_RECORD_SUBSCRIPTION,
} from "../graphql";

const UserControl = ({ user, setUser }) => {
  const [token, setToken] = useContext(AuthContext);

  const { displayStatus } = useContext(DisplayContext);

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
  //   variables: { patientName: user ? user.username : "" },
  //   context: { headers: { authorization: token ? `Bearer ${token}` : "" },
  // });

  const [
    getRecord,
    {
      loading,
      error,
      data: { queryUserRecords: records } = {},
      subscribeToMore,
      refetch,
    },
  ] = useLazyQuery(USER_RECORDS_QUERY, {
    context: { headers: { authorization: token ? `Bearer ${token}` : "" } },
  });

  useEffect(() => {
    try {
      subscribeToMore({
        document: PATIENT_RECORD_SUBSCRIPTION,
        variables: { patientName: user ? user.username : "" },
        updateQuery: (prev) => {
          refetch();
          return prev;
        },
      });
    } catch (e) {}
  }, [subscribeToMore, refetch]);

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
      {error && console.log(error)}
      {isLogin(user) ? (
        <div>
          <div style={{ position: "absolute", width: "100%" }}>
            姓名：{user.username}
          </div>
          <Button
            style={{
              position: "absolute",
              left: "33%",
              top: "6%",
              borderRadius: "5px",
            }}
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
              {user.username !== "admin" && (
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
                      try {
                        await changeUsername({
                          variables: {
                            auth: { password: info.password, ...user },
                            newUsername: info.newUsername,
                          },
                          context: {
                            headers: {
                              authorization: token ? `Bearer ${token}` : "",
                            },
                          },
                        });
                        setCnameModalVisible(false);
                        logout();
                      } catch (e) {
                        displayStatus({ type: "error", msg: e.message });
                      }
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
                  try {
                    await changePassword({
                      variables: {
                        auth: { password: info.oldPassword, ...user },
                        newPassword: info.newPassword,
                      },
                      context: {
                        headers: {
                          authorization: token ? `Bearer ${token}` : "",
                        },
                      },
                    });
                    setCpModalVisible(false);
                    logout();
                  } catch (e) {
                    displayStatus({ type: "error", msg: e.message });
                  }
                }}
                onCancel={() => setCpModalVisible(false)}
              />
            </SubMenu>
            {user.identity === "patient" && (
              <SubMenu
                key="my-record"
                title="我的病歷"
                onTitleClick={async () => {
                  try {
                    await getRecord({
                      variables: { patientName: user.username },
                      context: {
                        headers: {
                          authorization: token ? `Bearer ${token}` : "",
                        },
                      },
                    });
                  } catch (e) {
                    displayStatus({ type: "error", msg: e.message });
                  }
                }}
              >
                {records ? (
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
                  ))
                ) : (
                  <Spin
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                )}
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
                    try {
                      await createUser({
                        variables: { data: user },
                        context: {
                          headers: {
                            authorization: token ? `Bearer ${token}` : "",
                          },
                        },
                      });
                      setCreateModalVisible(false);
                    } catch (e) {
                      displayStatus({ type: "error", msg: e.message });
                    }
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
                  onCreate={async (user) => {
                    try {
                      await deleteUser({
                        variables: { username: user.username },
                        context: {
                          headers: {
                            authorization: token ? `Bearer ${token}` : "",
                          },
                        },
                      });
                      setDeleteModalVisible(false);
                    } catch (e) {
                      displayStatus({ type: "error", msg: e.message });
                    }
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
            style={{ borderRadius: "5px" }}
            onClick={() => {
              setLoginModalVisible(true);
            }}
          >
            登入
          </Button>
          <LoginModal
            visible={loginModalVisible}
            onCreate={async (user) => {
              try {
                const userReturn = await login({ variables: { data: user } });
                setUser({
                  username: userReturn.data.login.username,
                  identity: userReturn.data.login.identity,
                });
                setToken(userReturn.data.login.token);
                setLoginModalVisible(false);
              } catch (e) {
                displayStatus({ type: "error", msg: e.message });
              }
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
