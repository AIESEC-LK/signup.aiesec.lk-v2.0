import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import aiesec_man_animated from "../assets/aiesec_man_animated.gif";
import aiesec_man from "../assets/aiesec_man.png";


/// This is a progress bar and it improves the UX
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Submitting ...");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(progressInterval);
          setIsSuccess(true);
          setStatus("Successful");
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 30); // 3 seconds total (100 steps * 30ms)

    return () => clearInterval(progressInterval);
  }, [navigate]);

  return (
    <div className="loading-screen h-screen w-screen flex flex-col justify-center items-center bg-gray-900 p-48">
      <div className="loading-screen__spinner mb-4">
        <img src={aiesec_man_animated} alt="AIESEC man animation" />
      </div>
      <h1 className={`text-3xl mb-4 ${isSuccess ? "text-green-500" : "text-white"}`}>
        {status}
      </h1>
      <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-linear ${
            isSuccess ? "bg-green-500" : "bg-gray-600 dark:bg-gray-300"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
