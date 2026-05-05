import AuthWrapper from "@/components/auth/AuthWrapper";
import SignupForm from "@/components/auth/SignUpForm";

export default function SignupPage() {
    return (
        <AuthWrapper title="Register at Redolence" subtitle="Please Enter your details to get previleges" type="signup">
            <SignupForm />
        </AuthWrapper>

    );
}