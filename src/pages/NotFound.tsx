import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="p-8 shadow-xl text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <a href="/">
          <Button variant="primary" className="w-full">
            Return to Home
          </Button>
        </a>
      </Card>
    </div>
  );
};

export default NotFound;
