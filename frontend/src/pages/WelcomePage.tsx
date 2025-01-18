import { Link } from "react-router-dom";
import IIITLOGO from "../assets/IIIT LOGO.png";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

      <h1 className="text-4xl font-bold text-green-600 mb-6">
        Welcome to IIIT Flow
      </h1>

      <div className="mb-8">
        <img src={IIITLOGO} alt="IIIT BBSR LOGO" className="w-40 h-40 object-cover rounded-full shadow-lg" />
      </div>


      <Link
        to="/dashboard"
        className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-orange-400 transition duration-300"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default WelcomePage;
