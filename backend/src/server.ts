import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDatabase from "./database/database";

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});


connectDatabase();

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server working on http://localhost:${process.env.PORT || 3000}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
