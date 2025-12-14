import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const BASE_URL = "https://shamsi-store-backend.vercel.app";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/forgot-password`, { email: data.email });
      setSuccess(true);
      toast.current.show({
        severity: "success",
        summary: "Email Sent",
        detail: "If the email exists, a password reset link has been sent.",
        life: 5000,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err?.response?.data?.message || "Failed to send reset email",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen bg-primary-50">
      <Toast ref={toast} />
      <Card title="Forgot Password" className="w-full sm:w-20rem md:w-25rem shadow-3">
        {success ? (
          <div>
            <p className="mb-3">
              If the email exists, a password reset link has been sent to your email address.
            </p>
            <Button
              label="Back to Login"
              className="w-full"
              onClick={() => navigate("/login")}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="formgrid grid">
            <div className="field col-12">
              <span className="p-float-label w-full mt-3">
                <InputText
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "p-invalid w-full" : "w-full"}
                />
                <label htmlFor="email">Email</label>
              </span>
              {errors.email && <small className="p-error">{errors.email.message}</small>}
            </div>

            <div className="field col-12 mt-3">
              <Button
                type="submit"
                label={loading ? "Sending..." : "Send Reset Link"}
                className="w-full"
                disabled={loading}
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
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;

