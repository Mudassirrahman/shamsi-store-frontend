import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast } from "primereact/toast";

const BASE_URL = "https://shamsi-store-backend.vercel.app";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useRef(null);

  const hasVerified = useRef(false); // ✅ ADD THIS

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");

    // ✅ PREVENT DOUBLE CALL
    if (!token || hasVerified.current) return;

    hasVerified.current = true; // ✅ LOCK

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/auth/verify-email?token=${token}`
        );

        setVerified(true);
        toast.current.show({
          severity: "success",
          summary: "Email Verified",
          detail:
            "Your email has been verified successfully! You can now login.",
          life: 5000,
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Email verification failed");
        toast.current.show({
          severity: "error",
          summary: "Verification Failed",
          detail: err?.response?.data?.message || "Email verification failed",
          life: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex align-items-center justify-content-center min-h-screen bg-primary-50">
      <Toast ref={toast} />
      <Card
        title={
          verified
            ? "Email Verified"
            : error
            ? "Verification Failed"
            : "Verifying Email"
        }
        className="w-full sm:w-20rem md:w-25rem shadow-3"
      >
        {loading ? (
          <div className="text-center">
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
            <p className="mt-3">Verifying your email...</p>
          </div>
        ) : verified ? (
          <div>
            <p className="mb-3 text-green-600">
              Your email has been verified successfully! You can now login to
              your account.
            </p>
            <Button
              type="button" // ✅ SAFETY
              label="Go to Login"
              className="w-full"
              onClick={() => navigate("/login")}
            />
          </div>
        ) : (
          <div>
            <p className="mb-3 text-red-600">{error}</p>
            <Button
              type="button" // ✅ SAFETY
              label="Back to Login"
              className="w-full"
              onClick={() => navigate("/login")}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmail;
