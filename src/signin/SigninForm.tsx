import React from "react";
import { API_ENDPOINT } from "../../src/config/constants";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  errorNotification,
  successNotification,
} from "../Notification/Notification";
import { Toaster } from "react-hot-toast";

type Inputs = {
  email: string;
  password: string;
};

const SigninForm: React.FC = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;

    try {
      const response = await fetch(`${API_ENDPOINT}/users/sign_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        if (errorMessage.errors.length > 0) {
          errorNotification(errorMessage.errors);
        }
        throw new Error("Sign-in failed");
      }

      console.log("Sign-in successful");

      successNotification("Sign-in successful");

      const data = await response.json();

      localStorage.setItem("authTokenSportsCenter", data.auth_token);
      localStorage.setItem("userDataSportsCenter", JSON.stringify(data.user));
      navigate("/home");
    } catch (error) {
      console.error("Sign-in failed:", error);
      errorNotification("Sign-in failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter email..."
          autoFocus
          {...register("email", { required: true })}
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter password..."
          autoFocus
          {...register("password", { required: true })}
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-gray mt-4"
      >
        Sign In
      </button>
      <Toaster />
    </form>
  );
};

export default SigninForm;
