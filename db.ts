import mongoose from "mongoose";
import pusher from "./utils/pusher";

const URI =
  "mongodb+srv://favBoy:lBnTleS6hG1jXFac@cluster0.8fgkyzs.mongodb.net/?retryWrites=true&w=majority";
const dbConnection = () => {
  mongoose.connect(URI, () => {
    console.log(`db is connected`);
  });
  const db = mongoose.connection;
  db.once("open", () => {
    console.log("DB Connected");
    const msgCollection = db.collection("users");
    const changeStream = msgCollection.watch();
    changeStream.on("change", (change) => {
      if (change.operationType === "insert") {
        const userDetails = change.fullDocument;
        pusher.trigger("user", "inserted", {
          _id:userDetails._id,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          userName: userDetails.userName,
          password: userDetails.password,
          friends: userDetails.friends,
          requests:userDetails.requests
        });
      } else  {
      console.log(`error triggering pusher`)
      } 
    });
  });
};
export default dbConnection;
