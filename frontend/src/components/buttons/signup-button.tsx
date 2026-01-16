import { useSignUp } from "../../hooks/useSignUp";
import { FiUserPlus } from "react-icons/fi";

export const SignupButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { handleSignUp } = useSignUp();
  const iconSignUp = "icon-signup.svg";

  return !isCollapsed ? (
    <button
      className="button__sign-up flex items-center justify-center gap-2"
      onClick={handleSignUp}
    >
      <FiUserPlus aria-hidden="true" />
      Sign Up
    </button>
  ) : (
    <button onClick={handleSignUp} className="h-12">
      <img src={iconSignUp} alt="Sign Up" className="h-full" />
    </button>
  );
};
