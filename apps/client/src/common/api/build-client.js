import axios from "axios";
import { INGRESS_URL } from "../config";

export default ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: INGRESS_URL,
      headers: req.headers,
    });
  } else {
    return axios.create({});
  }
};
