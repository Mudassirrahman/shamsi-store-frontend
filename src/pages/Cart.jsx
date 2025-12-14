import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl text-center mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-5">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid">
          {cartItems.map((item) => (
            <div key={item._id} className="col-12 sm:col-6 md:col-4 lg:col-3">
              <Card
                header={
                  item.imageBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${item.imageBase64}`}
                      alt={item.name}
                      className="w-full"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : null
                }
                title={item.name}
                subTitle={`$${item.price} x ${item.quantity}`}
                className="mb-3 shadow-2 border-round"
              >
                <div className="flex flex-column gap-2">
                  <div className="flex align-items-center gap-2">
                    <label>Quantity:</label>
                    <InputNumber
                      value={item.quantity}
                      onValueChange={(e) => updateQuantity(item._id, e.value || 1)}
                      min={1}
                      showButtons
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div className="flex justify-content-between align-items-center">
                    <span className="font-bold">Total: ${item.price * item.quantity}</span>
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      onClick={() => removeFromCart(item._id)}
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}

          <div className="col-12">
            <Card className="shadow-2 border-round">
              <h4>Total Amount: ${totalAmount.toFixed(2)}</h4>
              <Button
                label="Proceed to Checkout"
                icon="pi pi-credit-card"
                className="mt-2 w-full"
                onClick={() => navigate("/checkout")}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
