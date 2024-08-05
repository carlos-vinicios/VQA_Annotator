// import { SignJWT, jwtVerify } from "jose";
import { parseCookies } from "nookies";

const encodeAuthData = (authData) => {
  return JSON.stringify(authData);
};

const decodeAuthData = (cookieKey) => {
  const cookies = parseCookies();
  const stringAuthData = cookies[cookieKey];

  try {
    if (stringAuthData !== undefined && stringAuthData !== null)
      return JSON.parse(stringAuthData);

    return stringAuthData;
  } catch (error) {
    console.log(error);
  }
  
  return null;
};

export { encodeAuthData, decodeAuthData };
