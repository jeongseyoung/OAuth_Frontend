import { InputBox } from "components/inputBox";
import "./style.css";
import React, { KeyboardEvent, ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInRequestDto } from "apis/req/auth";
import { SignInRequest, SNS_SIGN_IN_URL } from "apis";
import { ResponseBody } from "types";
import { SignInResponseDto } from "apis/res/auth";
import { ResponseCode } from "types/enum";
import { useCookies } from "react-cookie";

export default function SignIn() {
  const navigator = useNavigate();

  const [cookie, setCookie] = useCookies();

  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState<string>("");
  const [password, setPasword] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
    setMessage("");
  };
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasword(value);
    setMessage("");
  };

  const SignInResponse = (responseBody: ResponseBody<SignInResponseDto>) => {
    if (!responseBody) return;
    const { code, message } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert(message);
    if (code === ResponseCode.SIGN_IN_FAIL)
      setMessage("입력한 정보가 일치하지 않음");
    if (code === ResponseCode.DATABASE_ERROR) alert(message);
    if (code !== ResponseCode.SUCCESS) return;

    const { token, expirationTime } = responseBody as SignInResponseDto;
    const now = new Date().getTime() * 1000;
    const expires = new Date(now + expirationTime);
    setCookie("accessOken", token, { expires, path: "/" });
    alert("로그인 성공");
    navigator("/");
  };

  const onSignUpButtonClickHandler = () => {
    navigator("/auth/sign-up");
  };
  const onSignInButtonClickHandler = () => {
    if (!id || !password) {
      alert("아이디 비번 입력하세요");
      return;
    }
    const requestBody: SignInRequestDto = { id, password };
    SignInRequest(requestBody).then(SignInResponse);

    //navigator("/auth/sign-in");
  };

  const onSnsSignInButtonClickHandler = (
    type: "kakao" | "naver" | "google"
  ) => {
    window.location.href = SNS_SIGN_IN_URL(type);
    console.log("cookie", cookie);
  };

  const onIdKeyDownHanlder = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };
  const onPasswordKeyDownHanlder = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    onSignUpButtonClickHandler();
  };

  return (
    <div id="sign-in-warpper">
      <div className="sign-in-image"></div>
      <div className="sign-in-container">
        <div className="sign-in-box">
          <div className="sign-in-title">{"oauth"}</div>
          <div className="sign-in-content-box">
            <div className="sign-in-content-input-box">
              <InputBox
                ref={idRef}
                title="아이디"
                placeholder="아이디 입력"
                type="text"
                value={id}
                onChange={onIdChangeHandler}
                onKeyDown={onIdKeyDownHanlder}
              />
              <InputBox
                ref={passwordRef}
                title="비밀번호"
                placeholder="비밀번호"
                type="password"
                value={password}
                isError={true}
                errorMessage={message}
                onChange={onPasswordChangeHandler}
                onKeyDown={onPasswordKeyDownHanlder}
              />
            </div>
            <div className="sign-in-content-button-box">
              <div
                className="primary-button-lg full-width"
                onClick={onSignInButtonClickHandler}
              >
                {"로그인"}
              </div>
              <div
                className="text-link-lg full-width"
                onClick={onSignUpButtonClickHandler}
              >
                {"회원가입"}
              </div>
            </div>
            <div className="sign-in-content-sns-sign-in-box">
              <div className="sign-in-content-sns-sign-in-title">
                {"로그인"}
              </div>
              <div className="sign-in-content-sns-sign-in-button-box">
                <div
                  className="kakao-sign-in-button"
                  onClick={() => onSnsSignInButtonClickHandler("kakao")}
                ></div>
                <div
                  className="naver-sign-in-button"
                  onClick={() => onSnsSignInButtonClickHandler("naver")}
                ></div>
                <div
                  className="google-sign-in-button"
                  onClick={() => onSnsSignInButtonClickHandler("google")}
                ></div>
              </div>
            </div>
            <div className="sign-in-content-divider"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
