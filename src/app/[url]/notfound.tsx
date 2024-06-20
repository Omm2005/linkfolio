import Meteors from "@/components/ui/Metors"
import Link from "next/link"

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1QWqJ0WMQ9h
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function NotFoundPage({
    isThere
}: {
    isThere?: boolean

}) {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md text-center">
          <div className="a">
            <RocketIcon className="mx-auto h-32 w-32 text-white" />
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {
                isThere ? 'Rocket is under construction' : 'Oops! Lost in space? No Rocket found'
            }
          </h1>
          <p className="mt-4 text-lg text-white">
            {
                isThere ? 'The rocket you are looking for is under construction. Please check back later.' : 'It looks like you\'ve stumbled upon a black hole. Don\'t worry, we\'ll help you find your way back to the homepage.'
            }
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              prefetch={false}
            >
              Take me home
            </Link>
          </div>
        </div>
        <Meteors />
      </div>
    )
  }
  
  function RocketIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    )
  }