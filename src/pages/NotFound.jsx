import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1 className="text-center text-3xl mt-5">Page Not Found 😢</h1>
      <p className="text-center mt-2">
        Go back to{" "}
        <Link to="/" className="text-blue-500 underline">
          Home
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
