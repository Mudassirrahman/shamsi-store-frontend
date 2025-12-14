import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const BASE_URL = "https://shamsi-store-backend.vercel.app";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!token) {
      toast.current.show({
        severity: "error",
        summary: "Invalid Link",
        detail: "Reset token is missing. Please use the link from your email.",
        life: 5000,
      });
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/reset-password`, {
        token,
        password: data.password,
      });

      toast.current.show({
        severity: "success",
        summary: "Password Reset",
        detail: "Your password has been reset successfully. You can now login.",
        life: 5000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err?.response?.data?.message || "Failed to reset password",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const password = watch("password");

  return (
    <div className="flex align-items-center justify-content-center min-h-screen bg-primary-50">
      <Toast ref={toast} />
      <Card title="Reset Password" className="w-full sm:w-20rem md:w-25rem shadow-3">
        <form onSubmit={handleSubmit(onSubmit)} className="formgrid grid">
          <div className="field col-12" style={{ position: "relative" }}>
            <span className="p-float-label w-full mt-3">
              <InputText
                id="password"
                type={passwordVisible ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={errors.password ? "p-invalid w-full" : "w-full"}
              />
              <label htmlFor="password">New Password</label>
              <i
                className={`pi ${passwordVisible ? "pi-eye-slash" : "pi-eye"}`}
                style={{
                  position: "absolute",
                  right: "1.2rem",
                  top: "58%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1rem",
                }}
                onClick={() => setPasswordVisible((prev) => !prev)}
              ></i>
            </span>
            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>

          <div className="field col-12" style={{ position: "relative" }}>
            <span className="p-float-label w-full mt-3">
              <InputText
                id="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={errors.confirmPassword ? "p-invalid w-full" : "w-full"}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <i
                className={`pi ${confirmPasswordVisible ? "pi-eye-slash" : "pi-eye"}`}
                style={{
                  position: "absolute",
                  right: "1.2rem",
                  top: "58%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1rem",
                }}
                onClick={() => setConfirmPasswordVisible((prev) => !prev)}
              ></i>
            </span>
            {errors.confirmPassword && (
              <small className="p-error">{errors.confirmPassword.message}</small>
            )}
          </div>

          <div className="field col-12 mt-3">
            <Button
              type="submit"
              label={loading ? "Resetting..." : "Reset Password"}
              className="w-full"
              disabled={loading || !token}
            />
          </div>

          <div className="field col-12 mt-2">
            <Button
              label="Back to Login"
              className="w-full p-button-text"
              onClick={() => navigate("/login")}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;

