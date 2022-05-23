import io from "socket.io-client";

/*Create socket connection  */
export const socket = io('https://covid-sys.herokuapp.com/');