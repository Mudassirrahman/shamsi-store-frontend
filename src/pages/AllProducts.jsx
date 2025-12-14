import React, { useEffect, useRef, useState } from "react";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import ProductCarousel from "../components/ProductCarousel";

const AllProducts = () => {
  const toast = useRef(null);
  const { products, loading, error, fetchPublicProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchPublicProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.current.show({
      severity: "success",
      summary: "Added to Cart",
      detail: `${product.name} has been added to your cart.`,
      life: 2000,
    });
  };

  return (
    <div className="p-4">
      <ProductCarousel products={products} />
      <Toast ref={toast} />

      <Dialog
        header={selectedProduct?.name}
        visible={showDetail}
        onHide={() => setShowDetail(false)}
        style={{ width: "90vw", maxWidth: "600px" }}
      >
        {selectedProduct && (
          <div className="text-center">
            {selectedProduct.imageBase64 && (
              <img
                src={`data:image/*;base64,${selectedProduct.imageBase64}`}
                alt={selectedProduct.name}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                }}
              />
            )}
            <p>{selectedProduct.description}</p>
            <h4>${selectedProduct.price}</h4>
            <Button
              label="Add to Cart"
              icon="pi pi-shopping-cart"
              className="mt-3"
              onClick={() => {
                handleAddToCart(selectedProduct);
                setShowDetail(false);
              }}
            />
          </div>
        )}
      </Dialog>

      {loading && (
        <div
          className="flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {products.length === 0 && !loading ? (
        <div className="text-center mt-5">
          <p>No products available right now</p>
        </div>
      ) : (
        <>
          <h2 className="text-center text-2xl mb-4">All Products</h2>

          <div className="grid">
            {products.map((product) => (
              <div
                key={product._id}
                className="col-12 sm:col-6 md:col-4 lg:col-3"
              >
                <Card className="mb-4 shadow-2 border-round h-full flex flex-column justify-between">
                  {product.imageBase64 && (
                    <img
                      src={`data:image/*;base64,${product.imageBase64}`}
                      alt={product.name}
                      className="w-full border-round-top"
                      style={{ maxHeight: "180px", objectFit: "cover" }}
                    />
                  )}

                  <div className="p-3 flex flex-column gap-2">
                    <h3 className="m-0 text-lg font-semibold text-center">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {product.description}
                    </p>
                    <p className="font-bold text-center">
                      Price: ${product.price}
                    </p>

                    <Button
                      label="More Details"
                      icon="pi pi-eye"
                      className="p-button-outlined w-full"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDetail(true);
                      }}
                    />

                    <Button
                      icon="pi pi-shopping-cart"
                      label="Add to Cart"
                      className="w-full p-button-sm"
                      onClick={() => handleAddToCart(product)}
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
