import React, { useContext, useEffect, useState } from "react";
import { Product } from "../home/Home";
import { useSelector } from "react-redux";
import { WishlistContext } from "../../Context/WishlistContext";

function Wishlist() {
  const { userData } = useSelector((state) => {
    return state.user;
  });
  const { data, getWishListData } = useContext(WishlistContext);
  const [check, setCheck] = useState(true);
  const [height, setHeight] = useState("auto");
  const [comapreCounter, setCompareCounter] = useState(0);

  useEffect(() => {
    getWishListData();
  }, [check]);
  return (
    <div className="bg-white rounded row p-4 w-100 m-0 mt-3 mt-lg-5 ">
      {data?.map((e, index) => {
        return (
          <div className="mb-1 home">
            <Product
              setHeight={setHeight}
              index={index}
              data={e?.products}
              key={`0,82w${index}jkad`}
              setCompareCounter={setCompareCounter}
              check={check}
              setCheck={setCheck}
            />
          </div>
        );
      })}

      {data?.length == 0 && (
        <p className="text-center text-grey2 small p-0 m-0">
          No products added to wishlist
        </p>
      )}
    </div>
  );
}

export default Wishlist;
