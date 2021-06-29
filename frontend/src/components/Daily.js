import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";
import { makeStyles, GridListTile } from "@material-ui/core";
import { Button } from "antd";
import AppointmentModal from "./modals/AppointmentModal";
import PatientsModal from "./modals/PatientsModal";
import { DAILY_USER_RECORD_QUERY, APPOINTMENT_QUERY } from "../graphql";

const Daily = ({ user, date }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
      width: 1000,
    },
    date: {
      width: "100%",
    },
    passedDateTile: {
      background: "linear-gradient(135deg, #F0F0F0 30%, #E5E5E5 90%)",
      minHeight: 250,
      width: "14.2857%",
    },
    futureDateTile: {
      background: "linear-gradient(135deg, #FFFFE1 30%, #C8FAEA 90%)",
      minHeight: 250,
      width: "14.2857%",
    },
  }));
  const classes = useStyles();

  const thisDay = moment(date);

  const [modalVisible, setModalVisible] = useState(false);

  const {
    loading,
    error,
    data: { queryAppointment: dailyData } = {},
    subscribeToMore,
  } = useQuery(APPOINTMENT_QUERY, {
    variables: { date, auth: null },
  });

  const makeAppointment = (appointment) => {
    console.log({ user, date, appointment });
    // TODO: ask backend
  };

  const deleteAppointment = () => {
    console.log("delete: ", { user, date });
    // TODO: ask backend
  };

  const saveRecord = (record) => {
    console.log(record);
    // TODO: ask backend
  };

  return thisDay < moment().startOf("day") ? (
    <GridListTile key={date} className={classes.passedDateTile}>
      <p
        style={{
          position: "absolute",
          top: "5%",
          left: "0",
          right: "0",
          margin: "auto",
        }}
      >
        {thisDay.format("MM/DD")}
      </p>
    </GridListTile>
  ) : !dailyData ? (
    <GridListTile key={date} className={classes.futureDateTile}></GridListTile>
  ) : dailyData.doctor === "" ? (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p
        style={{
          position: "absolute",
          top: "5%",
          left: "0",
          right: "0",
          margin: "auto",
        }}
      >
        {thisDay.format("MM/DD")}
      </p>
      <p
        style={{
          position: "absolute",
          top: "40%",
          left: "0",
          right: "0",
          margin: "auto",
        }}
      >
        本日無服務
      </p>
    </GridListTile>
  ) : (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p
        style={{
          position: "absolute",
          top: "5%",
          left: "0",
          right: "0",
          margin: "auto",
        }}
      >
        {thisDay.format("MM/DD")}
      </p>
      <p
        style={{
          position: "absolute",
          top: "40%",
          left: "0",
          right: "0",
          margin: "auto",
        }}
      >
        物治學生：{dailyData.doctor}
      </p>
      <p
        style={{
          position: "absolute",
          top: "80%",
          left: "0",
          right: "0",
          margin: "auto",
        }}
      >
        目前預約人數：{dailyData.number}
      </p>
      {!user ? (
        <>{console.log(dailyData)}</>
      ) : user.identity === "patient" ? (
        dailyData.appointments.length > 0 &&
        dailyData.appointments[0].patient.username === user.username ? (
          <>
            <Button
              type="primary"
              style={{
                background: "rgb(7, 181, 59)",
                position: "absolute",
                top: "60%",
                left: "0",
                right: "0",
                margin: "auto",
              }}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <span className="material-icons">done</span>
              已預約
            </Button>
            {console.log(dailyData.appointments[0])}
            <AppointmentModal
              visible={modalVisible}
              mode="modify"
              appointment={dailyData.appointments[0]}
              onCreate={(appointment) => {
                makeAppointment(appointment);
                // setDailyData((oldDailyData) => ({
                //   ...oldDailyData,
                //   appointments: [
                //     { ...appointment, patient: { username: user.username } },
                //   ],
                // }));
                setModalVisible(false);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
              onDelete={() => {
                deleteAppointment();
                // setDailyData((oldDailyData) => ({
                //   ...oldDailyData,
                //   numbers: oldDailyData.numbers - 1,
                //   appointments: [],
                // }));
                setModalVisible(false);
              }}
            />
          </>
        ) : (
          <>
            <Button
              type="primary"
              style={{
                position: "absolute",
                top: "60%",
                left: "0",
                right: "0",
                margin: "auto",
              }}
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
                // setDailyData((oldDailyData) => ({
                //   ...oldDailyData,
                //   numbers: oldDailyData.numbers + 1,
                //   appointments: [
                //     { patient: { username: user.username }, ...appointment },
                //   ],
                // }));
                setModalVisible(false);
                console.log(dailyData);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
            />
          </>
        )
      ) : user.identity === "doctor" ? (
        <>
          <Button
            type="primary"
            style={{
              position: "absolute",
              top: "60%",
              left: "0",
              right: "0",
              margin: "auto",
            }}
            onClick={() => {
              setModalVisible(true);
            }}
          >
            查看
          </Button>
          <PatientsModal
            visible={modalVisible}
            mode="modify"
            appointments={dailyData.appointments || []}
            onCreate={(record) => {
              saveRecord(record);
              // setModalVisible(false);
            }}
            onCancel={() => {
              setModalVisible(false);
            }}
          />
        </>
      ) : (
        <></>
      )}
    </GridListTile>
  );
};

export default Daily;
