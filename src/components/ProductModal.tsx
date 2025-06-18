import { Modal } from "antd";
import type { Product } from "../types/IProduct";
import { useRef } from "react";

export const ProductModal = ({
  initialValue = null,
  isModalOpen,
  setIsModalOpen,
}: {
  initialValue: Product | null;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <Modal
      title={
        initialValue?.id ? `Update ${initialValue.name}` : "Create new product"
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      width={640}
      footer={null}
    >
      <iframe
        ref={iframeRef}
        width={"100%"}
        height={560}
        style={{ border: "none" }}
        src="http://localhost:3001"
      ></iframe>
    </Modal>
  );
};
