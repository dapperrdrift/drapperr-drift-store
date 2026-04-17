import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-y-auto no-scrollbar flex">
      <div className="flex flex-1 flex-col justify-start px-4 py-6 sm:px-6 sm:py-8 lg:px-20 lg:py-10 xl:px-24">
        <div className="mx-auto w-full">{children}</div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="/images/signup%20image.png"
          alt="Dapperr Drift auth"
          fill
          priority
          className="object-cover object-top"
          sizes="50vw"
        />
      </div>
    </div>
  )
}
