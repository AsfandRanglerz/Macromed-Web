import React, { useContext, useEffect } from "react";
import { NotificationContext } from "../../Context/NotificationContext";

function Notification() {
  const { data, readAllNotifications } = useContext(NotificationContext);

  useEffect(() => {
    readAllNotifications();
  }, []);

  return (
    <div className="bg-white row p-4 w-100 m-0 mt-3 mt-lg-5 rounded">
      {data.length > 0 ? (
        data?.map((e) => {
          return (
            <div className="pb-2 mb-4 notification-border-bottom">
              <span
                className={` ${
                  e?.status != "pending" ? "bg-primary" : "bg-warning"
                } rounded px-2 py-1 text-white`}
              >
                {e?.status.charAt(0).toUpperCase()}
                {e?.status.slice(1)}
              </span>
              <p className="mt-3">{e?.order_confirmation_message}</p>
            </div>
          );
        })
      ) : (
        <>
          <div className="text-center p-2 w-100">
            <p className="text-grey2 small p-0 m-0">No Notifications</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Notification;
