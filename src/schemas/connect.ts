import { connect } from "mongoose";
import { Logger } from "../utils/Logger";

export default (db) => {
  connect(db)
    .then(() => {
      Logger.info(`Connected to database`, { label: "INFO" });
    })
    .catch(() =>
      Logger.error(`Failed to connect to database`, { label: "ERROR" })
    );
};
