import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({
    children
}: Props) => {
  return (
    <main className='flex justify-center items-center w-screen min-h-screen h-screen' >   
        {children}
    </main>
  )
}

export default Layout