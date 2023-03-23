import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../common/hooks/use-request";

const SignOutPage = () => {
  const [doRequest] = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <>Signing out...</>;
};

export default SignOutPage;
