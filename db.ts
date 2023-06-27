import mongoose from "mongoose";

const URI =
  "mongodb+srv://root:Test123@cluster0.hw8gzdw.mongodb.net/?retryWrites=true&w=majority";
const dbConnection = () => {
  mongoose.connect(URI, () => {
    console.log(`db is connected`);
  });
};
export default dbConnection;
