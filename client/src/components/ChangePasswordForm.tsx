"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Kiểm tra độ mạnh mật khẩu
        if (name === "newPassword") {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return { text: "Rất yếu", color: "text-red-600" };
            case 2:
                return { text: "Yếu", color: "text-orange-600" };
            case 3:
                return { text: "Trung bình", color: "text-yellow-600" };
            case 4:
                return { text: "Mạnh", color: "text-blue-600" };
            case 5:
                return { text: "Rất mạnh", color: "text-green-600" };
            default:
                return { text: "", color: "" };
        }
    };

    const getPasswordStrengthWidth = () => {
        return `${(passwordStrength / 5) * 100}%`;
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return "bg-red-500";
            case 2:
                return "bg-orange-500";
            case 3:
                return "bg-yellow-500";
            case 4:
                return "bg-blue-500";
            case 5:
                return "bg-green-500";
            default:
                return "bg-gray-300";
        }
    };

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic xử lý đổi mật khẩu sẽ được thêm vào đây
        console.log("Đổi mật khẩu với:", formData);
    };

    const passwordsMatch = formData.newPassword === formData.confirmPassword;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
                        <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đổi mật khẩu
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Mật khẩu hiện tại */}
                        <div className="relative">
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Mật khẩu hiện tại
                            </label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type={
                                    showPasswords.current ? "text" : "password"
                                }
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Nhập mật khẩu hiện tại"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                                onClick={() =>
                                    togglePasswordVisibility("current")
                                }
                            >
                                {showPasswords.current ? (
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Mật khẩu mới */}
                        <div className="relative">
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Mật khẩu mới
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Nhập mật khẩu mới"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                                onClick={() => togglePasswordVisibility("new")}
                            >
                                {showPasswords.new ? (
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>

                            {/* Thanh đo độ mạnh mật khẩu */}
                            {formData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-500">
                                            Độ mạnh mật khẩu:
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                getPasswordStrengthText().color
                                            }`}
                                        >
                                            {getPasswordStrengthText().text}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{
                                                width: getPasswordStrengthWidth(),
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Xác nhận mật khẩu mới */}
                        <div className="relative">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Xác nhận mật khẩu mới
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={
                                    showPasswords.confirm ? "text" : "password"
                                }
                                autoComplete="new-password"
                                required
                                className={`appearance-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none sm:text-sm ${
                                    formData.confirmPassword && !passwordsMatch
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : formData.confirmPassword &&
                                          passwordsMatch
                                        ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                placeholder="Xác nhận mật khẩu mới"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                                onClick={() =>
                                    togglePasswordVisibility("confirm")
                                }
                            >
                                {showPasswords.confirm ? (
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>

                            {/* Thông báo xác nhận mật khẩu */}
                            {formData.confirmPassword && (
                                <div className="mt-1">
                                    {passwordsMatch ? (
                                        <div className="flex items-center text-green-600 text-xs">
                                            <svg
                                                className="h-4 w-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Mật khẩu khớp
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-600 text-xs">
                                            <svg
                                                className="h-4 w-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Mật khẩu không khớp
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Yêu cầu mật khẩu */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                            Yêu cầu mật khẩu:
                        </h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li className="flex items-center">
                                <span
                                    className={`mr-2 ${
                                        formData.newPassword.length >= 8
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {formData.newPassword.length >= 8
                                        ? "✓"
                                        : "○"}
                                </span>
                                Ít nhất 8 ký tự
                            </li>
                            <li className="flex items-center">
                                <span
                                    className={`mr-2 ${
                                        /[a-z]/.test(formData.newPassword)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {/[a-z]/.test(formData.newPassword)
                                        ? "✓"
                                        : "○"}
                                </span>
                                Chứa chữ thường
                            </li>
                            <li className="flex items-center">
                                <span
                                    className={`mr-2 ${
                                        /[A-Z]/.test(formData.newPassword)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {/[A-Z]/.test(formData.newPassword)
                                        ? "✓"
                                        : "○"}
                                </span>
                                Chứa chữ hoa
                            </li>
                            <li className="flex items-center">
                                <span
                                    className={`mr-2 ${
                                        /[0-9]/.test(formData.newPassword)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {/[0-9]/.test(formData.newPassword)
                                        ? "✓"
                                        : "○"}
                                </span>
                                Chứa số
                            </li>
                            <li className="flex items-center">
                                <span
                                    className={`mr-2 ${
                                        /[^A-Za-z0-9]/.test(
                                            formData.newPassword
                                        )
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {/[^A-Za-z0-9]/.test(formData.newPassword)
                                        ? "✓"
                                        : "○"}
                                </span>
                                Chứa ký tự đặc biệt
                            </li>
                        </ul>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!passwordsMatch || passwordStrength < 3}
                            className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
