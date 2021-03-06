import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import { getEnvironmentVaribles } from "./environments/env";
import UserRouter from "./routers/UserRouter";
import PostRouter from "./routers/PostRouter";
import CommentRouter from "./routers/CommentRouter";

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigurations();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfigurations() {
    this.connectMongodb();
    this.configureBodyParser();
  }

  connectMongodb() {
    const databaseUrl = getEnvironmentVaribles().db_url;
    mongoose
      .connect(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log("mongodb is connect");
      });
  }

  configureBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  setRoutes() {
    this.userRoutes();
  }

  userRoutes() {
    this.app.use('/src/uploads', express.static('src/uploads'));
    this.app.use("/api/user", UserRouter);
    this.app.use('/api/post', PostRouter);
    this.app.use('/api/comment', CommentRouter)
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not Found",
        status_code: 404,
      });
    });
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Something Went Wrong. Please Try Again",
        status_code: errorStatus,
      });
    });
  }
}
