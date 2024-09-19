import React, { ChangeEvent, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { InputBox } from "components/inputBox";
import { Route, Router, Routes } from "react-router-dom";
import SignUp from "views/Authentication/SignUp";
import SignIn from "views/Authentication/SignIn";
import OAuth from "views/Authentication/OAuth";

function App() {
  // const [id, setId] = useState<string>("");
  // const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  //   //const { value, validity } = event.target;
  //   console.log(event.target.value);
  //   setId(event.target.value);
  // };
  // const onIdButtonClickHandler = () => {};
  return (
    // <div>
    //   <InputBox
    //     title="아이디"
    //     placeholder="아이디를 입력해주세요."
    //     type="text"
    //     value={id}
    //     onChange={onChangeHandler}
    //     buttonTitle="중복확인"
    //     onButtonClick={onIdButtonClickHandler}
    //     errorMessage="사뇽가능한 아이디"
    //     isError={true}
    //   />
    //   <div className="disable-button-lg full-width">회원가입</div>
    //   <div className="text-link-lg full-width">회원가입</div>
    //   <div className="kakao-sign-in-button"></div>
    //   <div className="naver-sign-in-button"></div>
    // </div>
    <Routes>
      <Route path="/auth">
        <Route path="sign-up" element={<SignUp />}></Route>
        <Route path="sign-in" element={<SignIn />}></Route>
        <Route
          path="oauth-response/:token/:expirationTime"
          element={<OAuth />}
        />
      </Route>
    </Routes>
  );
}

export default App;
