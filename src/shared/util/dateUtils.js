import moment from "moment";

const convertTimestamp = (timestamp) => {
  return moment
    .unix(timestamp.seconds)
    .millisecond(timestamp.nanoseconds / 1000000)
    .format("DD/MM/YYYY HH:mm:ss");
}

export { convertTimestamp };
