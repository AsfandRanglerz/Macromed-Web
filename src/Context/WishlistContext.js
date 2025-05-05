import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token, userData } = useSelector((state) => {
    return state.user;
  });

  const [data, setData] = useState([]);

  const getWishListData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/getWhishList/${userData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data.data);
    } catch (err) {
      if (err.message === "Network Error") {
        toast.error("Check your internet connection");
      }
    }
  };

  useEffect(() => {
    const fetchWishListData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}api/getWhishList/${userData?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
      } catch (err) {
        if (err.message === "Network Error") {
          toast.error("Check your internet connection");
        }
      }
    };

    fetchWishListData();
  }, [token, userData?.id]);

  return (
    <WishlistContext.Provider
      value={{
        data,
        setData,
        getWishListData,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
