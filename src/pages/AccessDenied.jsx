import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen text-center px-3">
      <i className="pi pi-ban text-5xl text-red-500 mb-3" />
      <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
      <p className="mb-4">Aap ke paas is page tak access nahi hai.</p>

      <div className="flex gap-2 flex-wrap justify-content-center">
        <Button label="Go to Home" icon="pi pi-home" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default AccessDenied;
