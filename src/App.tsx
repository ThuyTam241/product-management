import "./App.css";
import { Button, Space, App as AntdApp } from "antd";
import { ProductList } from "./components/ProductList";
import { ProductModal } from "./components/ProductModal";
import { useEffect, useRef, useState } from "react";
import type { Product } from "./types/IProduct";
import { mockProducts } from "./mocks/products.mock";

function App() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { message } = AntdApp.useApp();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const receiveNewProductData = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3001") return;
      if (event.data.type === "dataAfterSubmitForm") {
        if (event.data.payload?.id) {
          setProducts((prev) =>
            prev.map((product) =>
              product?.id === event.data.payload?.id
                ? { ...product, ...event.data.payload.data }
                : product
            )
          );
        } else {
          const newProduct: Product = {
            ...event.data.payload.data,
            id: String(Date.now()),
          };
          setProducts((prev) => [...prev, newProduct]);
        }
        if (event.data.payload.status === "success") {
          message.success(
            `Product ${
              event.data.payload?.id ? "edited" : "created"
            } successfully`
          );
        } else {
          message.error(
            `Fail to ${event.data.payload?.id ? "edit" : "create"} product`
          );
        }
        setIsModalOpen(false);
      }
      if (event.data.type === "closeModal") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("message", receiveNewProductData);

    return () => {
      window.removeEventListener("message", receiveNewProductData);
    };
  }, []);

  const sendDataToProductForm = (product: Product | null) => {
    setIsModalOpen(true);
    setEditingProduct(product);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "productData",
          payload: product,
        },
        "http://localhost:3001"
      );
    }
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
            onClick={() => sendDataToProductForm(null)}
          >
            ADD PRODUCT
          </Button>
        </div>

        <ProductList
          products={products}
          setProducts={setProducts}
          sendDataToProductForm={sendDataToProductForm}
        />
      </Space>

      <ProductModal
        iframeRef={iframeRef}
        initialValue={editingProduct}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        sendDataToProductForm={sendDataToProductForm}
      />
    </>
  );
}

export default App;
