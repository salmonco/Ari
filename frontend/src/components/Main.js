import React, { useState } from "react";
import "../App.css";
import Map from "../services/map/Map";
import SideBar from "./SideBar";

const Main = () => {
  const userState = 0; // 0:비회원 1:손님 2:사장님 3:관리자
  const [isOpend, setIsOpened] = useState(false);

  const onClick = () => {
    setIsOpened(!isOpend);
  };

  return (
    <>
      <div>
        {isOpend ? (
          <Map
            alt=""
            name="darkImage"
            onClick={onClick}
            src="images/map.jpg"
          ></Map>
        ) : (
          <>
            <Map />
          </>
        )}
      </div>

      <button className="side_btn" onClick={onClick}>
        <img alt="" src="images/button.png"></img>
      </button>
      {isOpend ? <SideBar userState={userState} /> : null}
    </>
  );
};

export default Main;
