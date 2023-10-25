import React from "react";
import SigninForm from "./SigninForm";

const Signin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Sign in
        </h1>
        <SigninForm />
        <h1 className="text-sm font-semibold text-gray-800 mb-8 mt-5">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:text-blue-600">
            Sign up
          </a>
        </h1>
      </div>
    </div>
  );
};
export default Signin;
