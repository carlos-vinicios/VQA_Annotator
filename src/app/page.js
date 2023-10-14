"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    //caso o usuário não esteja autenticado, ele será redirecionado para a página de login
    if (status === "unauthenticated") {
      redirect("/login");
    } else {
      redirect(`/${session.user.stage}`);
    }
  }, [status, session]);

  return <></>;
}
