import "./App.css";
import { Button, Space } from "antd";
import { ProductList } from "./components/ProductList";
import { ProductModal } from "./components/ProductModal";
import { useState } from "react";
import type { Product } from "./types/IProduct";
import { mockProducts } from "./mocks/products.mock";

function App() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openProductForm = (isOpen: boolean, product: Product | null) => {
    setIsModalOpen(isOpen);
    setEditingProduct(product);
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

      <ProductModal
        initialValue={editingProduct}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

export default App;
