import { Modal } from "antd";
import type { Product } from "../types/IProduct";

export const ProductModal = ({
  iframeRef,
  initialValue = null,
  isModalOpen,
  setIsModalOpen,
  sendDataToProductForm,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  initialValue: Product | null;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  sendDataToProductForm: (product: Product | null) => void;
}) => {
  const handleCancel = () => {
    setIsModalOpen(false);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "resetForm" },
        "http://localhost:3001"
      );
    }
  };

  return (
    <Modal
      title={
        initialValue?.id ? `Update ${initialValue.name}` : "Create new product"
      }
      open={isModalOpen}
      onCancel={handleCancel}
      width={640}
      footer={null}
    >
      <iframe
        ref={iframeRef}
        width={"100%"}
        height={560}
        style={{ border: "none" }}
        onLoad={() => sendDataToProductForm(initialValue)}
        src="http://localhost:3001"
      ></iframe>
    </Modal>
  );
};
