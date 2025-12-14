import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";
import { FileUpload } from "primereact/fileupload";

const AdminDashboard = () => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    fetchOrders,
    updateOrderStatus,
  } = useOrderStore();

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Add Product");
  const [imageFile, setImageFile] = useState(null);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const onUpload = ({ files }) => {
    const file = files[0];
    setImageFile(file);
  };

  const onSubmit = async (data) => {
    if (!editMode && !imageFile) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (editMode) {
      await updateProduct(editId, formData);
      setEditMode(false);
      setEditId(null);
    } else {
      await addProduct(formData);
    }

    reset();
    setImageFile(null);
    setVisible(false);
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditId(product._id);
    setDialogTitle("Edit Product");
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setVisible(true);
  };

  const actionTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      <Button label="Edit" onClick={() => handleEdit(rowData)} />
      <Button
        label="Delete"
        severity="danger"
        onClick={() => deleteProduct(rowData._id)}
      />
    </div>
  );

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailVisible(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
  ];

  const orderStatusTemplate = (rowData) => {
    return (
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        onChange={(e) => handleStatusChange(rowData._id, e.value)}
        className="w-full"
      />
    );
  };

  const orderActionTemplate = (rowData) => (
    <Button
      label="View Details"
      icon="pi pi-eye"
      onClick={() => handleViewOrder(rowData)}
    />
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-4" style={{marginTop:"4rem"}}>
      <TabView>
        <TabPanel header="Products">
          <Card title="Product Management">
        <div className="mb-3">
          <Button
            label="Add Product"
            icon="pi pi-plus"
            onClick={() => {
              setDialogTitle("Add Product");
              setEditMode(false);
              reset();
              setImageFile(null);
              setVisible(true);
            }}
          />
        </div>

        <DataTable
          value={products}
          paginator
          rows={5}
          loading={loading}
          className="mb-3"
        >
          <Column
            header="Image"
            body={(rowData) =>
              rowData.imageBase64 ? (
                <img
                  src={`data:image/jpeg;base64,${rowData.imageBase64}`}
                  alt={rowData.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                <span>No Image</span>
              )
            }
          />
          <Column field="name" header="Name" />
          <Column field="description" header="Description" />
          <Column field="price" header="Price" />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>

        {error && <small className="p-error">{error}</small>}
          </Card>
        </TabPanel>

        <TabPanel header="Orders">
          <Card title="Order Management">
            <DataTable
              value={orders}
              paginator
              rows={10}
              loading={ordersLoading}
              className="mb-3"
            >
              <Column field="_id" header="Order ID" />
              <Column
                field="customerName"
                header="Customer Name"
              />
              <Column field="email" header="Email" />
              <Column field="phone" header="Phone" />
              <Column
                field="totalAmount"
                header="Total Amount"
                body={(rowData) => `$${rowData.totalAmount.toFixed(2)}`}
              />
              <Column
                header="Status"
                body={orderStatusTemplate}
              />
              <Column
                field="createdAt"
                header="Order Date"
                body={(rowData) => formatDate(rowData.createdAt)}
              />
              <Column header="Actions" body={orderActionTemplate} />
            </DataTable>

            {ordersError && <small className="p-error">{ordersError}</small>}
          </Card>
        </TabPanel>
      </TabView>

      <Dialog
        header={dialogTitle}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        breakpoints={{ "960px": "90vw" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="formgrid grid mt-2">
          <div className="field col-12">
            <span className="p-float-label mt-5">
              <InputText
                id="name"
                {...register("name", { required: "name is required" })}
                className={errors.name ? "p-invalid w-full" : "w-full"}
              />
              <label htmlFor="name">Title</label>
            </span>
          </div>

          <div className="field col-12">
            <span className="p-float-label mt-3">
              <div className="field col-12">
                <span className="p-float-label mt-3">
                  <FileUpload
                    name="image"
                    accept="image/*"
                    mode="basic"
                    auto
                    customUpload
                    uploadHandler={onUpload}
                    chooseLabel={
                      editMode ? "Change Image (optional)" : "Upload Image"
                    }
                  />
                </span>

                {!editMode && !imageFile && (
                  <small className="p-error">Image is required</small>
                )}
              </div>
            </span>
          </div>

          <div className="field col-12">
            <span className="p-float-label mt-3">
              <InputText
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                className={errors.description ? "p-invalid w-full" : "w-full"}
              />
              <label htmlFor="description">Description</label>
            </span>
          </div>

          <div className="field col-12">
            <span className="p-float-label mt-3">
              <InputText
                id="price"
                {...register("price", { required: "Price is required" })}
                className={errors.price ? "p-invalid w-full" : "w-full"}
              />
              <label htmlFor="price">Price</label>
            </span>
          </div>

          <div className="col-12 mt-2">
            <Button
              type="submit"
              label={editMode ? "Update" : "Add"}
              className="w-full"
            />
          </div>
        </form>
      </Dialog>

      <Dialog
        header="Order Details"
        visible={orderDetailVisible}
        style={{ width: "70vw" }}
        onHide={() => setOrderDetailVisible(false)}
        breakpoints={{ "960px": "90vw" }}
      >
        {selectedOrder && (
          <div>
            <div className="grid mb-3">
              <div className="col-12 md:col-6">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
              </div>
              <div className="col-12 md:col-6">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <h4>Ordered Products</h4>
            <DataTable value={selectedOrder.items || []} className="mt-2">
              <Column
                header="Product"
                body={(rowData) =>
                  rowData.productId && typeof rowData.productId === "object"
                    ? rowData.productId.name
                    : "Product"
                }
              />
              <Column
                header="Image"
                body={(rowData) =>
                  rowData.productId &&
                  typeof rowData.productId === "object" &&
                  rowData.productId.imageBase64 ? (
                    <img
                      src={`data:image/*;base64,${rowData.productId.imageBase64}`}
                      alt={rowData.productId.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <span>No Image</span>
                  )
                }
              />
              <Column field="quantity" header="Quantity" />
              <Column
                field="price"
                header="Price"
                body={(rowData) => `$${rowData.price.toFixed(2)}`}
              />
              <Column
                header="Subtotal"
                body={(rowData) => `$${(rowData.quantity * rowData.price).toFixed(2)}`}
              />
            </DataTable>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
