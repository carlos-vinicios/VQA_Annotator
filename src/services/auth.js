import Router from "next/router";
import { encodeAuthData } from "@/services/jwt";
import { destroyCookie } from "nookies";
import { setCookie } from "nookies";

const signOut = () => {
  destroyCookie(undefined, "systems");

  Router.push("/login");
};

const setAuthDataCookie = ({ email, stage, access_token, refresh_token }) => {
  encodeAuthData({
    email,
    stage,
    access_token,
    refresh_token,
  }).then((jwtUserData) => {
    setCookie(undefined, "systems", jwtUserData);
  }).catch(() => {
    console.log("Falha no registro da sessão de usuário")
  });
};

export { signOut, setAuthDataCookie };
