import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50 text-gray-900">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-extrabold text-[#1A96EB]">404</h1>
        <h2 className="text-2xl font-bold font-[Reddit_Sans] text-gray-900">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-sm">
          Sorry, the page or tour package you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#1A96EB] text-white font-medium hover:bg-[#1578BC] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/tours"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Browse Tour Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
