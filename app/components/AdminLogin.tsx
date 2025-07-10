import React, { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  handleAdminLogin: (e: FormEvent<HTMLFormElement>) => void;
  password: string;
  setPassword: (password: string) => void;
}

export function AdminLoginModal({
  isOpen,
  handleAdminLogin,
  password,
  onClose,
  setPassword,
}: AdminLoginProps) {
  const { isAdmin, logout } = useAuth();

  const handleAdminLogout = () => {
    logout();
    toast.info("Logged Out From Admin Access");
  };

  if (!isOpen) return null;

  return (
    // The background overlay that closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-grey bg-opacity-60 p-4 backdrop-blur-sm"
      onClick={onClose} // Use onClose directly
    >
      {/* Modal content container with stopPropagation */}
      <div
        className="w-full max-w-xs mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Conditional UI based on admin status */}
        {isAdmin ? (
          <div className="p-4 mb-4 text-center bg-green-100 border-l-4 border-green-500 rounded-lg">
            <p className="font-semibold text-green-800">
              Admin access is active.
              <br/>
              ⚠️Admin Access is Reset when Refreshing Page⚠️
            </p>
            <button
              onClick={handleAdminLogout}
              className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log out
            </button>
          </div>
        ) : (
          <div className="p-3 mb-4 text-center bg-yellow-100 border-l-4 border-yellow-500 rounded-lg">
            <p className="text-sm font-semibold text-yellow-800">
              Admin access is required for special actions.
            </p>
          </div>
        )}

        {/* Login Form */}
        {/* conditionally hide this form if the user is already an admin */}
        {!isAdmin && (
          <form
            onSubmit={handleAdminLogin}
            className="rounded-lg bg-gray-100 p-4 shadow-md text-center"
          >
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Admin Access <br/>
              ⚠️Admin Access is Reset when Refreshing Page⚠️
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-tenaris-blue-dark"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Unlock
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
