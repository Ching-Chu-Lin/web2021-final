import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";
import { makeStyles, GridListTile } from "@material-ui/core";
import { Button } from "antd";
import AppointmentModal from "./modals/AppointmentModal";
import PatientsModal from "./modals/PatientsModal";
import AuthContext from "../context/AuthContext";
import {
  APPOINTMENT_QUERY,
  CREATE_APPOINTMENT_MUTATION,
  DELETE_APPOINTMENT_MUTATION,
} from "../graphql";

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

  const [token, setToken] = useContext(AuthContext);

  const thisDay = moment(date);

  const [modalVisible, setModalVisible] = useState(false);

  const {
    loading,
    error,
    data: { queryAppointment: dailyData } = {},
    subscribeToMore,
    refetch,
  } = useQuery(APPOINTMENT_QUERY, {
    variables: { date },
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  useEffect(() => refetch(), [token]);

  const [makeAppointment] = useMutation(CREATE_APPOINTMENT_MUTATION);

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT_MUTATION);

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
        <></>
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
            <AppointmentModal
              visible={modalVisible}
              mode="modify"
              appointment={dailyData.appointments[0]}
              onCreate={async (appointment) => {
                const appointmentReturn = await makeAppointment({
                  variables: { data: { date, ...appointment } },
                  context: {
                    headers: {
                      authorization: token ? `Bearer ${token}` : "",
                    },
                  },
                });
                setModalVisible(false);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
              onDelete={async () => {
                await deleteAppointment({
                  variables: { date },
                  context: {
                    headers: {
                      authorization: token ? `Bearer ${token}` : "",
                    },
                  },
                });
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
              onCreate={async (appointment) => {
                const appointmentReturn = await makeAppointment({
                  variables: { data: { date, ...appointment } },
                  context: {
                    headers: {
                      authorization: token ? `Bearer ${token}` : "",
                    },
                  },
                });
                setModalVisible(false);
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
            date={date}
            appointments={dailyData.appointments || []}
            // onCreate={async (record) => {
            //   await saveRecord({
            //     variables: { data: { date, ...record }, auth: user },
            //   });
            // }}
            onCancel={() => {
              setModalVisible(false);
            }}
            user={user} // only for authentication
          />
        </>
      ) : (
        <></>
      )}
    </GridListTile>
  );
};

export default Daily;
