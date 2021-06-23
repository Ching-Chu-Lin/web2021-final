import { useState } from "react";
import moment from "moment";
import { makeStyles, GridListTile } from "@material-ui/core";
import { Button } from "antd";
import AppointmentModal from "./modals/AppointmentModal";

const Daily = ({ user, date }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
      width: 1000,
    },
    header: {
      width: "100%",
      height: 50,
    },
    date: {
      width: "100%",
    },
    headerTile: {
      backgroundColor: "rgb(220, 254, 209)",
    },
    passedDateTile: {
      backgroundColor: "rgb(240, 240, 240)",
      minHeight: 250,
      width: "14.2857%",
    },
    futureDateTile: {
      backgroundColor: "rgb(255, 254, 209)",
      minHeight: 250,
      width: "14.2857%",
    },
  }));
  const classes = useStyles();

  const thisDay = moment(date);

  const [modalVisible, setModalVisible] = useState(false);

  // const [dailyData, setDailyData] = useState({});

  const dailyData = {
    physiotherapyStudent: "怪醫黑傑克",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: [
      {
        name: "",
        appointment: { part: "頭", level: 8.7, description: "智商不足" },
      },
    ],
  };

  const makeAppointment = (appointment) => {
    console.log({ user, date, appointment });
  };

  const deleteAppointment = () => {
    console.log("delete: ", { user, date });
  };

  return thisDay < moment().startOf("day") ? (
    <GridListTile key={date} className={classes.passedDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
    </GridListTile>
  ) : dailyData.availableTime === "" ? (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
      <p style={{ color: "red" }}>本日無服務</p>
    </GridListTile>
  ) : (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
      <p>物治學生：{dailyData.physiotherapyStudent}</p>
      <p>服務時間：{dailyData.availableTime}</p>
      <p>目前預約人數：{dailyData.numbers}</p>
      {dailyData.patients ? (
        <>
          <Button
            type="primary"
            style={{ background: "rgb(7, 181, 59)" }}
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <span className="material-icons">done</span>
            已預約
          </Button>
          <AppointmentModal
            visible={modalVisible}
            mode="modify"
            appointment={dailyData.patients[0].appointment}
            onCreate={(appointment) => {
              makeAppointment(appointment);
              setModalVisible(false);
            }}
            onCancel={() => {
              setModalVisible(false);
            }}
            onDelete={() => {
              deleteAppointment();
              setModalVisible(false);
            }}
          />
        </>
      ) : (
        <>
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            預約
          </Button>
          <AppointmentModal
            visible={modalVisible}
            mode="create"
            onCreate={(appointment) => {
              makeAppointment(appointment);
              setModalVisible(false);
            }}
            onCancel={() => {
              setModalVisible(false);
            }}
          />
        </>
      )}
    </GridListTile>
  );
};

export default Daily;
