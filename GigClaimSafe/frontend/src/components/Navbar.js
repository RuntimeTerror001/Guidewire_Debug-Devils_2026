import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="text-2xl font-bold gradient-text cursor-pointer">
                🛡️ GigClaimSafe
              </div>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/onboarding">
              <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Register
              </span>
            </Link>
            <Link href="/dashboard">
              <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Dashboard
              </span>
            </Link>
            <Link href="/plans">
              <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Plans
              </span>
            </Link>
            <Link href="/disruptions">
              <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Monitor
              </span>
            </Link>
            <Link href="/claims">
              <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Claims
              </span>
            </Link>
            <Link href="/admin">
              <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Admin
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
