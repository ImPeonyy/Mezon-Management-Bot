import Link from "next/link";
import PublicRoute from "@/components/PublicRoute";

function HomeContent() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Mezon Management Clan
                    </h1>
                </div>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Link
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                        href="/login"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        Đăng Nhập
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function Home() {
    return (
        <PublicRoute>
            <HomeContent />
        </PublicRoute>
    );
}
