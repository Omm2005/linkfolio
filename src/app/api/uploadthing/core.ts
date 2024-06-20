
import { getServerAuthSession } from '@/server/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()


const authenticateUser = async() => {
  const session = await getServerAuthSession()
  // If you throw, the user will not be able to upload
  if (!session?.user) throw new Error('Unauthorized')
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return session.user
}


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatar: f({ image: { maxFileSize: '1MB', maxFileCount: 1 } })
    .middleware(authenticateUser as any)
    .onUploadComplete(() => {}),
  banner: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(authenticateUser as any)
    .onUploadComplete(() => {})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter