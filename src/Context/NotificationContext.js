import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, useToast } from "react-toastify";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token, userData, login } = useSelector((state) => {
    return state.user;
  });

  const [data, setData] = useState([]);
  const [seen, setSeen] = useState(0);

  const getNotification = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}api/getOrderNotification/${userData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setData(res?.data?.notifcation_message);
        setSeen(res?.data?.seen_notification);
      })
      .catch((err) => {
        if (err.message == "Network Error") {
          toast.error("Check your internet connection");
        }
      });
  };

  const readAllNotifications = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}api/seenBy/${userData?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.message == "Notifications have been seen!") {
          setSeen(0);
        }
      })
      .catch((err) => {
        if (err.message == "Network Error") {
          toast.error("Check your internet connection");
        }
      });
  };

  useEffect(() => {
    if (login == true) {
      getNotification();

      const interval = setInterval(getNotification, 20000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        data,
        seen,
        getNotification,
        readAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
