import { useSignUp } from "../../hooks/useSignUp";

export const SignupButton = () => {
  const { handleSignUp } = useSignUp();

  return (
    <button className="button__sign-up" onClick={handleSignUp}>
      Sign Up
    </button>
  );
};
