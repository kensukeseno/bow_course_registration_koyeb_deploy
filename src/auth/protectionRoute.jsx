import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authentication";

export default function ProtectionRoute() {
  //const { currentUser } = useAuth();
  const { currentUser, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return !currentUser ? <Navigate to="/login" replace /> : <Outlet />;
}
// Did the if else statement on hand first before converting it to a ternary operator
// return (
// if (!currentUser){
//     <Navigate to="/login" replace />;
// }
// return <Outlet />;
// )};
