'use server'

import React from 'react'
import ProfileForm from "@/components/form/ProfileForm"
import { getProfileData } from '@/server/actions'
import { redirect } from 'next/navigation'

type Props = {}

const page = async(props: Props) => {
  const userDB = await getProfileData()
if(userDB === null || userDB?.url === null) {
  redirect('/')
}

  
const formattedData = {
  id: userDB.id,
  url: userDB.url,
  name: userDB.name,
  designation: userDB.designation,
  image: userDB.image,
  description: userDB.bio,
}
  return (
    <section className='bg-background text-foreground'>
      <ProfileForm data={formattedData} />
    </section>
  )
}

export default page