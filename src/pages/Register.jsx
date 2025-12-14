import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Register = () => {
  const {
    registerUser,
    loading,
    error,
    clearError, // ✅ added
  } = useAuthStore();

  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // ✅ CLEAR ERROR WHEN PAGE LOADS
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = (data) => {
    const { role, ...userData } = data;

    clearError(); // optional safety

    registerUser(userData, (message) => {
      setSuccessMessage(
        message ||
          "Registration successful! Please check your email to verify your account."
      );
    });
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen bg-primary-50">
      <Card title="Register" className="w-full sm:w-20rem md:w-25rem shadow-3">
        <form onSubmit={handleSubmit(onSubmit)} className="formgrid grid">
          <div className="field col-12">
            <span className="p-float-label w-full mt-3">
              <InputText
                id="name"
                {...register("name", { required: "Name is required" })}
                className={errors.name ? "p-invalid w-full" : "w-full"}
              />
              <label htmlFor="name">Name</label>
            </span>
            {errors.name && (
              <small className="p-error">{errors.name.message}</small>
            )}
          </div>

          <div className="field col-12">
            <span className="p-float-label w-full mt-3">
              <InputText
                id="email"
                {...register("email", { required: "Email is required" })}
                className={errors.email ? "p-invalid w-full" : "w-full"}
              />
              <label htmlFor="email">Email</label>
            </span>
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>

          <div className="field col-12" style={{ position: "relative" }}>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <span className="p-float-label w-full mt-3">
                  <InputText
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    {...field}
                    className={errors.password ? "p-invalid w-full" : "w-full"}
                  />
                  <label htmlFor="password">Password</label>

                  <i
                    className={`pi ${
                      passwordVisible ? "pi-eye-slash" : "pi-eye"
                    }`}
                    style={{
                      position: "absolute",
                      right: "1.2rem",
                      top: "58%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setPasswordVisible((prev) => !prev)}
                  />
                </span>
              )}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </div>

          <div className="field col-12 mt-2">
            <Button
              type="submit"
              label={loading ? "Registering..." : "Register"}
              className="w-full"
              disabled={loading}
            />
          </div>

          {successMessage && (
            <div className="mt-2 p-3 border-round bg-green-50 border-1 border-green-200">
              <small className="text-green-700 block">{successMessage}</small>
              <Button
                type="button"
                label="Go to Login"
                className="mt-2 w-full"
                onClick={() => navigate("/login")}
              />
            </div>
          )}

          {error && <small className="p-error block mt-2">{error}</small>}
        </form>
      </Card>
    </div>
  );
};

export default Register;
