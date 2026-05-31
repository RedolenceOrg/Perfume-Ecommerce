import AuthWrapper from "@/components/auth/AuthWrapper";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <AuthWrapper
            title="Reset Password"
            subtitle="We'll send a code to your email"
            type="login"
        >
            <ForgotPasswordForm />
        </AuthWrapper>
    );
}