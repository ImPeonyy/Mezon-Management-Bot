import ChangePasswordForm from "@/components/ChangePasswordForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ChangePasswordPage() {
    return (
        <ProtectedRoute>
            <ChangePasswordForm />
        </ProtectedRoute>
    );
}
