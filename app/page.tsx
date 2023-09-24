import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212]">
      {/* navbar -- make into component */}
      <div className="max-w-screen bg-red-400 p-2 flex align-center min-h-10">
        <Link href="#">
          <h1 className="text-white hover:underline text-extrabold text-xl bg-blue-400">
            FORT&Iacute;S
          </h1>
        </Link>
      </div>
    </div>
  )
}
