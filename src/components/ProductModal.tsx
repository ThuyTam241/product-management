import { Modal } from "antd";
import type { Product } from "../types/IProduct";

export const ProductModal = ({
  initialValue = null,
  isModalOpen,
  setIsModalOpen,
}: {
  initialValue: Product | null;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) => {
  return (
    <Modal
      title={
        initialValue?.id ? `Update ${initialValue.name}` : "Create new product"
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    ></Modal>
  );
};
