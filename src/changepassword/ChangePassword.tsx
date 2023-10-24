/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../config/constants";
import { useContext } from "react";
import { ThemeContext } from "../context/theme";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import {
  errorNotification,
  successNotification,
} from "../Notification/Notification";

type Inputs = {
  current_password: string;
  new_password: string;
};

const UpdatePassword = () => {
  let [isOpen, setIsOpen] = useState(true);
  const { theme } = useContext(ThemeContext);
  const [error, setError] = useState(null);
  const [isLoading, setloading] = useState<boolean>(false);

  let navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
    navigate("../");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!isLoading) {
      setloading(true);
      const token = localStorage.getItem("authTokenSportsCenter") ?? "";

      const { current_password, new_password } = data;

      try {
        const response = await fetch(`${API_ENDPOINT}/user/password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ current_password, new_password }),
        });

        setloading(false);

        if (response.ok) {
          successNotification("Password updated successfully");
          closeModal();
        }
        const Rdata = await response.json();
        if (Rdata.status === "error") {
          errorNotification(Rdata.message);
        }
      } catch (error) {
        console.log("Error while changing password:", error);
        setError(null);
        closeModal();
      }
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`relative z-100 ${theme ?? ""}`}
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex font-bold justify-between text-lg  leading-6 text-gray-900 items-center dark:text-white"
                  >
                    Update Password
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {error && <span>{error}</span>}
                      <input
                        type="text"
                        id="current_password"
                        placeholder="Enter current password..."
                        autoFocus
                        {...register("current_password", { required: true })}
                        className={`w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue dark:text-white dark:bg-gray-700 ${
                          errors.current_password ? "border-red-500" : ""
                        }`}
                      />
                      {errors.current_password && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                      <input
                        type="text"
                        id="new_password"
                        placeholder="Enter new password..."
                        autoFocus
                        {...register("new_password", { required: true })}
                        className={`w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue dark:text-white dark:bg-gray-700 ${
                          errors.new_password ? "border-red-500" : ""
                        }`}
                      />
                      {errors.new_password && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                      <div>
                        <button
                          id="update-password"
                          type="submit"
                          className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 mr-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                            isLoading ? "cursor-not-allowed disabled" : ""
                          }`}
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </button>
                        <button
                          type="submit"
                          onClick={closeModal}
                          className={`inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          <Toaster />
        </Dialog>
      </Transition>
    </>
  );
};

export default UpdatePassword;
