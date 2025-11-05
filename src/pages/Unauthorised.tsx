import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { IRootState } from "../store";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";

const Unauthorised = () => {
  const { isAuthenticated, role, isVerified } = useSelector(
    (state: IRootState) => state.auth
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="p-8 shadow-xl text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page is Forbidden</p>
        <p className="text-gray-500 mb-8">
          You don’t have permission to access this page. If you believe this is
          a mistake, please contact support.
        </p>
        <Link
          to={
            !isAuthenticated
              ? "/"
              : role !== "psychologist" || isVerified === true
              ? `/${role}/dashboard`
              : "/psychologist/application"
          }
        >
          <Button variant="primary" className="w-full">
            {!isAuthenticated
              ? "Return To Home"
              : role !== "psychologist" || isVerified === true
              ? "Return To Dashboard"
              : "Return to Application Page"}
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Unauthorised;
