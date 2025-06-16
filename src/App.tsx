import "./App.css";
import { Button, ConfigProvider, message, Space } from "antd";
import { ProductList } from "./components/ProductList";
import { ProductForm } from "./components/ProductForm";
import { useState } from "react";
import type { Product } from "./types/IProduct";
import { mockProducts } from "./data/mockProducts";
import { Dayjs } from "dayjs";

function App() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openProductForm = (isOpen: boolean, product: Product | null) => {
    setIsModalOpen(isOpen);
    setEditingProduct(product);
  };

  const onSubmitForm = (formData: Product) => {
    const payload = {
      ...formData,
      expiredAt: formData.expiredAt ? (formData.expiredAt as Dayjs).format("YYYY-MM-DD") : ''
    };
    if (editingProduct?.id) {
      setEditingProduct((prev) => ({ ...prev, ...payload }));
      setProducts((prev) =>
        prev.map((product) =>
          product?.id === editingProduct.id
            ? { ...product, ...payload }
            : product
        )
      );
      message.success("Product edited successfully");
    } else {
      const newProduct: Product = { ...payload, id: String(Date.now()) };
      setProducts([...products, newProduct]);
      message.success("Product created successfully");
    }
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2B2B2B",
          colorText: "#2B2B2B",
          controlOutline: "#2B2B2B40",
        },
        components: {
          Select: {
            optionSelectedBg: "#2B2B2B30",
          },
        },
      }}
    >
      <Space size="middle" direction="vertical" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            color="default"
            variant="solid"
            style={{
              padding: "10px 16px",
              height: "auto",
              borderRadius: 12,
            }}
            onClick={() => openProductForm(true, null)}
          >
            ADD PRODUCT
          </Button>
        </div>

        <ProductList
          products={products}
          setProducts={setProducts}
          openProductForm={openProductForm}
        />
      </Space>

      <ProductForm
        initialValue={editingProduct}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSubmitForm={onSubmitForm}
      />
    </ConfigProvider>
  );
}

export default App;
