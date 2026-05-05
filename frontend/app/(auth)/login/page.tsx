import AuthWrapper from "@/components/auth/AuthWrapper";
import LoginForm from "@/components/auth/LoginForm";
export default function LoginPage() {
    return (
        <AuthWrapper
            title="Welcome back"
            subtitle="Please enter your details to access your curated collection."
            type="login"
        >
            <LoginForm />
        </AuthWrapper>
    );
}