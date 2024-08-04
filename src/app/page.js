"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {

  useEffect(() => {
    //caso o usuário não esteja autenticado, ele será redirecionado para a página de login
    redirect("/login");
    if (status === "unauthenticated") {
    } else {
      redirect(`/${session.user.stage}`);
    }
  }, []);

  return <></>;
}
