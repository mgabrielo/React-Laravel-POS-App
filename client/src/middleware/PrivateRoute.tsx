import { FC } from "react";
import { useStore } from "../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const PrivateRoute: FC<{ element: JSX.Element }> = ({ element }) => {
  const {
    rootStore: {
      authstore: { isAuthenticated },
    },
  } = useStore();

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return element;
};

export default observer(PrivateRoute);
