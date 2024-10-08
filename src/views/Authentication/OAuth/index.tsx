import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

// 쿠키에 토큰 등록
export default function OAuth() {
  const { token, expirationTime } = useParams();
  const [cookie, setCookie] = useCookies();
  const navigator = useNavigate();
  useEffect(() => {
    if (!token || !expirationTime) return;

    const now = new Date().getTime() * 1000;
    const expires = new Date(now + Number(expirationTime));

    setCookie("accessToken", token, { expires, path: "/" });
    navigator("/");
  }, []);
  return <div>index</div>;
}
