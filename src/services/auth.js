import Router from "next/router";
import { encodeAuthData } from "@/services/jwt";
import { destroyCookie } from "nookies";
import { setCookie } from "nookies";

const signOut = () => {
  destroyCookie(undefined, "systems");
  Router.push("/login");
};

const setAuthDataCookie = ({ email, stage, access_token, refresh_token }) => {
  const encodedAuthData = encodeAuthData({
    email,
    stage,
    access_token,
    refresh_token,
  });
  setCookie(undefined, "systems", encodedAuthData);
};

export { signOut, setAuthDataCookie };
