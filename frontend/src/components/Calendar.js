import moment from "moment";
import { makeStyles, GridList, GridListTile } from "@material-ui/core";
import Daily from "./Daily";

const Calendar = ({ user }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      borderRadius: "10px",
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
      display: "table",
      background: 'linear-gradient(160deg, #D1E0FF 30%, #C1E0FF 90%)',
    },
  }));
  const classes = useStyles();

  const nextTwoWeeks = () => {
    const beginOfCurrentWeek = moment().startOf("week");
    let days = [];
    for (let i = 0; i < 14; i++) {
      days.push(beginOfCurrentWeek.format("YYYY-MM-DD"));
      beginOfCurrentWeek.add(1, "days");
    }
    return days;
  };

  const weekdayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const showingDays = nextTwoWeeks();

  return (
    <div className={classes.root}>
      <GridList cellHeight={50} cols={7} className={classes.header}>
        {weekdayName.map((e) => (
          <GridListTile className={classes.headerTile}>
            <span style={{position: "absolute",top: "10%", left: "0", right: "0", margin: "auto"}}>{e}</span>
          </GridListTile>
        ))}
      </GridList>
      <GridList cellHeight={200} cols={7} className={classes.date}>
        {showingDays.map((date) => (
          <Daily user={user} date={date} />
        ))}
      </GridList>
    </div>
  );
};

export default Calendar;
