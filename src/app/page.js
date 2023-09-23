'use client'

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession();
  
  //aqui será feito o contole do usuário que está anotando
  useEffect(() => {
    redirect('/annotation')
  }, [])

  useEffect(() => {
    if(status === 'unauthenticated'){
      redirect("/login")
    }
  }, [status])

  
  return (
    <></>
  );
}