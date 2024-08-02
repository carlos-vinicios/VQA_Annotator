import { encodeAuthData } from "@/services/jwt";
import { destroyCookie } from "nookies";
import { setCookie } from "nookies";

const signOut = () => {
  destroyCookie(undefined, "systems");
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
