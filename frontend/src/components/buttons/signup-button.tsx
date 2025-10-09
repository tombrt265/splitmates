import { useSignUp } from "../../hooks/useSignUp";

export const SignupButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { handleSignUp } = useSignUp();
  const iconSignUp = "icon-signup.svg";

  return !isCollapsed ? (
    <button className="button__sign-up" onClick={handleSignUp}>
      Sign Up
    </button>
  ) : (
    <button onClick={handleSignUp} className="h-12">
      <img src={iconSignUp} alt="Sign Up" className="h-full" />
    </button>
  );
};
