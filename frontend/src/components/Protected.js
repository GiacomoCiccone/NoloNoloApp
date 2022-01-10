import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Protected = (props) => {
  //redux stuff
  const { authToken } = useSelector((state) => state.user);

  useEffect(() => {
    if (!authToken) {
      props.history.push("/login");
    }
  }, [props.history, authToken]);

  return <>{props.children}</>;
};

export default Protected;