import { useState } from "react";
import AuthContent from "../../components/auth/AuthContent";
import { Credentials } from "../../types/credentials";
import { createUser } from "../../utils/auth";

function SignupScreen() {

    const [isSubmiting, setIsSubmiting] = useState(false);

    async function signupHandler({ name, email, password }: Credentials) {
        setIsSubmiting(true);
        await createUser({ name, email, password });
        setIsSubmiting(false);
    }

    return <AuthContent isLogin={false} onAuthenticate={signupHandler} isSubmiting={isSubmiting} />;
}

export default SignupScreen;