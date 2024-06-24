import { SignJWT, jwtVerify } from "jose";
import { parseCookies } from "nookies";

// Função para gerar um token JWT
const encodeAuthData = async ({
  email,
  stage,
  access_token,
  refresh_token,
}) => {
  // Criando o token JWT
  const jwt = await new SignJWT({ email, stage, access_token, refresh_token })
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_SINGLE_SYSTEM_KEY));
  
  return jwt;
};

// Função para decodificar um token JWT
const decodeAuthData = async (cookieKey) => {
  try {
    const cookies = parseCookies();
    const jwt = cookies[cookieKey];

    // Verificando e decodificando o token JWT
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_SINGLE_SYSTEM_KEY)
    );
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { encodeAuthData, decodeAuthData };
