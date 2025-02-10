import { useState } from "react";
import AuthContent from "../../components/auth/AuthContent";
import { Credentials } from "../../types/credentials";
import { loginUser } from "../../utils/auth";

function LoginScreen() {

    const [isSubmiting, setIsSubmiting] = useState(false);

    async function loginHandler({ email, password }: Credentials) {
        setIsSubmiting(true);
        await loginUser({ email, password });
        setIsSubmiting(false);
    }

    return <AuthContent isLogin={true} onAuthenticate={loginHandler} isSubmiting={isSubmiting} />;
}

export default LoginScreen;