import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const { cartItems, cartTotal, resetCart } = useCartStore();
  const { createOrder, loading, error, orderSuccess, resetOrderSuccess } = useOrderStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (orderSuccess) {
      toast.current.show({
        severity: "success",
        summary: "Order Placed",
        detail: "Your order has been placed successfully!",
        life: 5000,
      });
      resetCart();
      resetOrderSuccess();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [orderSuccess, navigate, resetCart, resetOrderSuccess]);

  useEffect(() => {
    if (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 5000,
      });
    }
  }, [error]);

  const onSubmit = async (data) => {
    try {
      const orderData = {
        customerName: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);
    } catch (err) {
      // Error is handled by useEffect
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-12 md:col-8">
          <Card title="Checkout Information" className="mb-4">
            <form onSubmit={handleSubmit(onSubmit)} className="formgrid grid">
              <div className="field col-12">
                <span className="p-float-label w-full mt-3">
                  <InputText
                    id="name"
                    {...register("name", { required: "Full name is required" })}
                    className={errors.name ? "p-invalid w-full" : "w-full"}
                  />
                  <label htmlFor="name">Full Name</label>
                </span>
                {errors.name && <small className="p-error">{errors.name.message}</small>}
              </div>

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

              <div className="field col-12">
                <span className="p-float-label w-full mt-3">
                  <InputText
                    id="phone"
                    {...register("phone", { required: "Phone number is required" })}
                    className={errors.phone ? "p-invalid w-full" : "w-full"}
                  />
                  <label htmlFor="phone">Phone Number</label>
                </span>
                {errors.phone && <small className="p-error">{errors.phone.message}</small>}
              </div>

              <div className="field col-12">
                <span className="p-float-label w-full mt-3">
                  <InputText
                    id="address"
                    {...register("address", { required: "Address is required" })}
                    className={errors.address ? "p-invalid w-full" : "w-full"}
                  />
                  <label htmlFor="address">Address</label>
                </span>
                {errors.address && <small className="p-error">{errors.address.message}</small>}
              </div>

              <div className="field col-12 mt-3">
                <Button
                  type="submit"
                  label={loading ? "Placing Order..." : "Place Order"}
                  className="w-full"
                  disabled={loading}
                  icon="pi pi-check"
                />
              </div>
            </form>
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card title="Order Summary" className="mb-4">
            <div className="mb-3">
              <h4>Items:</h4>
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-content-between mb-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-top-1 pt-3">
              <div className="flex justify-content-between text-xl font-bold">
                <span>Total:</span>
                <span>${cartTotal().toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

