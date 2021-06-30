import { Modal, Button } from "antd";
import { useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import OpendayForm from "../forms/OpendayForm";
import AuthContext from "../../context/AuthContext";
import { OPENDAY_QUERY } from "../../graphql";

const OpendayModal = ({ visible, onCancel }) => {
  const [token, setToken] = useContext(AuthContext);

  const createFooter = () => {
    return [
      <Button key="close" onClick={onCancel}>
        關閉
      </Button>,
    ];
  };

  const {
    loading,
    error,
    data: { queryOpenday: opendays } = {},
    subscribeToMore,
    refetch,
  } = useQuery(OPENDAY_QUERY, {
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  useEffect(() => refetch(), [token]);

  // const opendays = [
  //   { weekday: "SUNDAY", doctor: "" },
  //   { weekday: "MONDAY", doctor: "1" },
  //   { weekday: "TUESDAY", doctor: "2" },
  //   { weekday: "WEDNESDAY", doctor: "3" },
  //   { weekday: "THURSDAY", doctor: "4" },
  //   { weekday: "FRIDAY", doctor: "5" },
  //   { weekday: "SATURDAY", doctor: "" },
  // ];

  return (
    <Modal
      visible={visible}
      title="服務時間"
      footer={createFooter()}
      onCancel={onCancel}
    >
      {opendays && opendays.map((day) => <OpendayForm day={day} />)}
    </Modal>
  );
};
export default OpendayModal;
