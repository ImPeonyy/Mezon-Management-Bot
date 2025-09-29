"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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
                return { text: "Mạnh", color: "text-green-600" };
            default:
                return { text: "", color: "" };
        }
    };

    const getPasswordStrengthWidth = () => {
        return `${(passwordStrength / 4) * 100}%`;
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
                return "bg-green-500";
            default:
                return "bg-gray-300";
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setIsSubmitting(true);

        try {
            // Import API service
            const { authAPI } = await import("@/services/api");

            const response = await authAPI.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            if (response.success) {
                setMessage({
                    type: "success",
                    text: (response.message || "Đổi mật khẩu thành công!") + " Đang chuyển về dashboard...",
                });
                // Reset form
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setPasswordStrength(0);
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setMessage({
                    type: "error",
                    text: response.message || "Đổi mật khẩu thất bại",
                });
            }
        } catch (error: unknown) {
            // console.error("Change password error:", error);

            // Xử lý lỗi từ API response
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                if (apiError.response?.data?.message) {
                    setMessage({
                        type: "error",
                        text: apiError.response.data.message,
                    });
                } else {
                    setMessage({
                        type: "error",
                        text: "Có lỗi xảy ra. Vui lòng thử lại.",
                    });
                }
            } else {
                setMessage({
                    type: "error",
                    text: "Có lỗi xảy ra. Vui lòng thử lại.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
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
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Đổi mật khẩu
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {message.text && (
                        <div
                            className={`px-4 py-3 rounded relative ${
                                message.type === "success"
                                    ? "bg-green-50 border border-green-200 text-green-700"
                                    : "bg-red-50 border border-red-200 text-red-700"
                            }`}
                        >
                            <div className="flex items-center">
                                {message.type === "success" ? (
                                    <svg
                                        className="h-5 w-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                {message.text}
                            </div>
                        </div>
                    )}

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
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Nhập mật khẩu hiện tại"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
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
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Nhập mật khẩu mới"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />

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
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none sm:text-sm ${
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
                        </ul>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
                            onClick={() => {
                                router.push('/dashboard');
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={
                                !passwordsMatch ||
                                passwordStrength < 3 ||
                                isSubmitting
                            }
                            className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Đang xử lý...
                                </>
                            ) : (
                                "Đổi mật khẩu"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
