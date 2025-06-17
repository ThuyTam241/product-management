import "./App.css";
import { Button, App as AntdApp, Space } from "antd";
import { ProductList } from "./components/ProductList";
import { ProductForm } from "./components/ProductForm";
import { useState } from "react";
import type { Product } from "./types/IProduct";
import { mockProducts } from "./mocks/products.mock";
import { Dayjs } from "dayjs";

function App() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { message } = AntdApp.useApp();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openProductForm = (isOpen: boolean, product: Product | null) => {
    setIsModalOpen(isOpen);
    setEditingProduct(product);
  };

  const onSubmitForm = (formData: Product) => {
    const file = formData.thumbnail as any;
    const resolvedThumbnail = file?.file
      ? URL.createObjectURL(file.file)
      : "";
    const payload = {
      ...formData,
      thumbnail: resolvedThumbnail,
      expiredAt: formData.expiredAt
        ? (formData.expiredAt as Dayjs).format("YYYY-MM-DD")
        : "",
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
    <>
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
    </>
  );
}

export default App;
