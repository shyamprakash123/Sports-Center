import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Oops! This page could not be found.
      </h2>
      <Link
        to="/"
        className="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
      >
        Go to homepage
      </Link>
    </div>
  );
}
