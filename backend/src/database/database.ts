import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    //@ts-ignore
    .connect(process.env.URI)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.log("Error connecting to database");
      console.log(error);
    });
};

export default connectDatabase;
