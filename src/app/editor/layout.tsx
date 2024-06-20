import Navbar from '@/components/Navbar'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
}

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getServerAuthSession()
if(session === null) {
  redirect('/')
}
 const user = session.user
  
  return (
    <main className='h-screen w-screen overflow-hidden min-h-screen max-w-screen md:px-10 py-3 px-3 gap-5 flex flex-col'>
    <Navbar user={user} />
    <main className='h-full w-full overflow-y-scroll'>
    {children}
    </main>
  </main>
  )
}