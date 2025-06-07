"use client";
import Link from "next/link";


export default function NotFound() {
  return (
    <div className="h-[100%] flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="text-center">
        {/* <Image src={NotFoundImage} alt="404 Not Found" width={300} height={300} /> */}
        <h1 className="text-4xl font-bold mt-6">Page Not Found</h1>
        <p className="text-lg mt-4 text-gray-600">
          Oops! The page you are looking for does not exist.
        </p>
        <Link href="/">
        
            Go Back to Home
         
        </Link>
      </div>
    </div>
  );
}