import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Image,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import { getColorByTag } from "../constants/tagColors";
import type { Product } from "../types/IProduct";
const { Text } = Typography;

export const ProductList = ({
  products,
  setProducts,
  openProductForm,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  openProductForm: (isOpen: boolean, product: Product | null) => void;
}) => {
  const handleConfirm = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    message.success("Product deleted successfully.");
  };

  const handleCancel = () => {
    message.info("Deletion canceled.");
  };

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Product name",
      key: "product-name",
      render: (_, record: Product) => (
        <Space style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {record.thumbnail && (
            <Image
              src={record.thumbnail}
              alt={record.name}
              width={40}
              height={40}
              preview={false}
            />
          )}
          <Text>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
    },
    {
      title: "Expired At",
      dataIndex: "expiredAt",
      key: "expiredAt",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      key: "price",
      render: (_, record: Product) => (
        <Text>${record.price.toFixed(2)}</Text>
      ),
    },
    {
      title: "Tags",
      key: "tags",
      render: (_, record: Product) => (
        <>
          {record.tags?.map((tag, index) => (
            <Tag key={index} color={getColorByTag(tag)}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      render: (_, record: Product) => (
        <>
          <Badge
            color={record.status === "in_stock" ? "green" : "red"}
            text={record.status === "in_stock" ? "In Stock" : "Out of Stock"}
          />
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Product) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "transparent" }}
            type="text"
            onClick={() => openProductForm(true, record)}
            icon={<EditOutlined style={{ fontSize: "20px" }} />}
          />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleConfirm(record.id)}
            onCancel={handleCancel}
            okButtonProps={{ color: "default", variant: "solid" }}
            okText="Yes"
            cancelButtonProps={{
              variant: "outlined",
              style: { borderColor: "#d9d9d9", color: "rgba(0, 0, 0, 0.88)" },
            }}
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "transparent" }}
              type="text"
              icon={<DeleteOutlined style={{ fontSize: "20px" }} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<Product>
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={products}
      pagination={{
        pageSize: 8,
      }}
    />
  );
};
