import { InputBox } from "components/inputBox";
import "./style.css";
import React, { KeyboardEvent, ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCertificationRequestDto,
  EmailCertificationRequestDto,
  IdCheckRequestDto,
  SignUpRequestDto,
} from "apis/req/auth";
import {
  checkCertificationRequest,
  emailCertificationRequest,
  idCheckRequest,
  signUpRequest,
  SNS_SIGN_IN_URL,
} from "apis";
import {
  CheckCertificationResponseDto,
  EmailCertificationResponseDto,
  IdCheckResponseDto,
  SignUpResponseDto,
} from "apis/res/auth";
import { ResponseDto } from "apis/res";
import { ResponseCode } from "types/enum";
import { ResponseBody } from "types";
// import from "./style.css";

export default function SignUp() {
  const navigator = useNavigate();

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])([a-zA-Z0-9]){8,13}$/;

  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const certificationNumberRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState<string>("");
  const [password, setPasword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [certificationNumber, setCertificationNumber] = useState<string>("");

  const [isIdError, setIdError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckError] =
    useState<boolean>(false);
  const [isEmailError, setEmailError] = useState<boolean>(false);
  const [isCertificationNumberError, setCertificationNumberError] =
    useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [passwordCheckMessage, setpasswordCheckMessage] = useState<string>("");
  const [emailMessage, setemailMessage] = useState<string>("");
  const [certificationNumberMessage, setcertificationNumberMessage] =
    useState<string>("");

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
    setIdMessage("");
    setIdCheck(false);
  };
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasword(value);
    setPasswordMessage("");
  };
  const onPasswordCheckChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPasswordCheck(value);
    setpasswordCheckMessage("");
  };
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setemailMessage("");
  };
  const onCertificationNumberChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setCertificationNumber(value);
    setcertificationNumberMessage("");
  };

  const idCheckResponse = (responseBody: ResponseBody<IdCheckResponseDto>) => {
    if (!responseBody) return;
    const { code, message } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert(message);
    if (code === ResponseCode.DUPLICATED_ID) {
      setIdError(true);
      setIdMessage("아이디 중복");
      setIdCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert(message);
    if (code !== ResponseCode.SUCCESS) {
      //alert("failed to check id \n need contact admin.");
      return;
    }

    setIdError(false);
    setIdMessage("사뇽 가능한 아이디");
    setIdCheck(true);
  };

  const emailCertificationResponse = (
    responseBody: ResponseBody<EmailCertificationResponseDto>
  ) => {
    if (!responseBody) return;
    const { code, message } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert(message);
    if (code === ResponseCode.DUPLICATED_ID) {
      setIdError(true);
      setIdMessage("이미 사용중인 아이디");
      setIdCheck(false);
    }
    if (code === ResponseCode.MAIL_SEND_FAILED) alert(message);
    if (code === ResponseCode.DATABASE_ERROR) alert(message);
    if (code !== ResponseCode.SUCCESS) return;

    setEmailError(false);
    setemailMessage("인증번호 전송");
  };

  const checkCertificationResponse = (
    responseBody: ResponseBody<CheckCertificationResponseDto>
  ) => {
    if (!responseBody) return;
    const { code, message } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert(message);
    if (code === ResponseCode.CERTIFICATION_FAIL) {
      alert(message);
      setCertificationNumberError(true);
      setcertificationNumberMessage("인증번호 일치하지 않음");
      setCertificationCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert(message);
    if (code !== ResponseCode.SUCCESS) return;

    setCertificationNumberError(false);
    setcertificationNumberMessage("인증번호 확인됨");
    setCertificationCheck(true);
  };

  const signUpResponse = (responseBody: ResponseBody<SignUpResponseDto>) => {
    if (!responseBody) return;
    const { code, message } = responseBody;
    if (code === ResponseCode.DUPLICATED_ID) {
      setIdError(true);
      setIdMessage("아이디 중복");
      setIdCheck(false);
    }
    if (code === ResponseCode.CERTIFICATION_FAIL) {
      alert(message);
      setCertificationNumberError(true);
      setcertificationNumberMessage("인증번호 일치하지 않음");
      setCertificationCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert(message);
    if (code !== ResponseCode.SUCCESS) return;

    alert("회원가입 완료");
    navigator("/auth/sign-up");
  };

  // id중복확인버튼,
  const onIdButtonClickHandler = () => {
    // id입력이 null, 공백일때는 return;
    if (!id) return;
    const requestBody: IdCheckRequestDto = { id };

    idCheckRequest(requestBody).then(idCheckResponse);
  };
  const onEmailButtonClickHandler = () => {
    if (!id && !email) return;
    const patternCheck = emailPattern.test(email);
    if (!patternCheck) {
      setEmailError(true);
      setemailMessage("이메일 형식으로 입력하세요");
      return;
    }
    const requestBody: EmailCertificationRequestDto = { id, email };
    if (isIdError) {
      alert("아이디 중복확인을 먼저 ㄱㄱ");
      return;
    }
    emailCertificationRequest(requestBody).then(emailCertificationResponse);
  };
  const onCertificationNumberButtonClickHandler = () => {
    if (!id && email && !certificationNumber) return;

    const requestBody: CheckCertificationRequestDto = {
      id,
      email,
      certificationNumber,
    };
    checkCertificationRequest(requestBody).then(checkCertificationResponse);
  };
  const onSignUpButtonClickHandler = () => {
    if (!email && !id && !password && !passwordCheck && !certificationNumber)
      return;
    if (!isIdCheck) {
      alert("중복확인해주세요");
      return;
    }
    if (!passwordPattern.test(password)) {
      setPasswordError(true);
      setPasswordMessage("비밀번호형식에 맞춰서");
      return;
    }
    if (password !== passwordCheck) {
      setPasswordCheckError(true);
      setpasswordCheckMessage("비번이 일치하지않음");
      return;
    }
    if (!isCertificationCheck) {
      alert("인증필수");
      return;
    }
    const requestBody: SignUpRequestDto = {
      certificationNumber,
      email,
      id,
      password,
    };
    signUpRequest(requestBody).then(signUpResponse);
  };
  const onSignInButtonClickHandler = () => {
    navigator("/auth/sign-up");
  };

  const onIdKeyDownHanlder = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    onIdButtonClickHandler();
  };
  const onPasswordKeyDownHanlder = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  };
  const onPasswordCheckKeyDownHanlder = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") return;
    if (!emailRef.current) return;
    emailRef.current.focus();
  };
  const onEmailKeyDownHanlder = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (!certificationNumberRef.current) return;
    onEmailButtonClickHandler();
  };
  const onCertificationNumberKeyDownHanlder = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") return;
    if (!certificationNumberRef.current) return;
    onCertificationNumberButtonClickHandler();
  };

  const onSnsSignInButtonClickHandler = (type: "kakao" | "naver") => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  const [isIdCheck, setIdCheck] = useState<boolean>(false);
  const [isCertificationCheck, setCertificationCheck] =
    useState<boolean>(false);
  const signUpButtonClass =
    id && password && passwordCheck && email && certificationNumber
      ? "primary-button-lg"
      : "disable-button-lg";

  return (
    <div id="sign-up-warpper">
      <div className="sign-up-image"></div>
      <div className="sign-up-container">
        <div className="sign-up-box">
          <div className="sign-up-title">{"oauth"}</div>
          <div className="sign-up-content-box">
            <div className="sign-up-content-sns-sign-up-box">
              <div className="sign-up-content-sns-sign-up-title">
                {"회원가입"}
              </div>
              <div className="sign-up-content-sns-sign-up-button-box">
                <div
                  className="kakao-sign-in-button"
                  onClick={() => onSnsSignInButtonClickHandler("kakao")}
                ></div>
                <div
                  className="naver-sign-in-button"
                  onClick={() => onSnsSignInButtonClickHandler("naver")}
                ></div>
              </div>
            </div>
            <div className="sign-up-content-divider"></div>
            <div className="sign-up-content-input-box">
              <InputBox
                ref={idRef}
                title="아이디"
                placeholder="아이디 입력"
                type="text"
                value={id}
                isError={isIdError}
                errorMessage={idMessage}
                buttonTitle="중복확인"
                onChange={onIdChangeHandler}
                onButtonClick={onIdButtonClickHandler}
                onKeyDown={onIdKeyDownHanlder}
              />
              <InputBox
                ref={passwordRef}
                title="비밀번호"
                placeholder="비밀번호"
                type="password"
                value={password}
                isError={isPasswordError}
                errorMessage={passwordMessage}
                onChange={onPasswordChangeHandler}
                onKeyDown={onPasswordKeyDownHanlder}
              />
              <InputBox
                ref={passwordCheckRef}
                title="비밀번호 확인"
                placeholder="비밀번호 확인"
                type="password"
                value={passwordCheck}
                isError={isPasswordCheckError}
                errorMessage={passwordCheckMessage}
                onChange={onPasswordCheckChangeHandler}
                onKeyDown={onPasswordCheckKeyDownHanlder}
              />
              <InputBox
                ref={emailRef}
                title="이메일"
                placeholder="이메일 입력"
                type="text"
                value={email}
                isError={isEmailError}
                errorMessage={emailMessage}
                buttonTitle="이메일 인증"
                onChange={onEmailChangeHandler}
                onButtonClick={onEmailButtonClickHandler}
                onKeyDown={onEmailKeyDownHanlder}
              />
              <InputBox
                ref={certificationNumberRef}
                title="인증번호"
                placeholder="인증번호 4자리 입력"
                type="text"
                value={certificationNumber}
                isError={isCertificationNumberError}
                errorMessage={certificationNumberMessage}
                buttonTitle="인증확인"
                onChange={onCertificationNumberChangeHandler}
                onButtonClick={onCertificationNumberButtonClickHandler}
                onKeyDown={onCertificationNumberKeyDownHanlder}
              />
            </div>
            <div className="sign-up-content-button-box">
              <div
                className={`${signUpButtonClass} 'full-width'`}
                onClick={onSignUpButtonClickHandler}
              >
                {"회원가입"}
              </div>
              <div
                className="text-link-lg full-width"
                onClick={onSignInButtonClickHandler}
              >
                {"로그인"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
