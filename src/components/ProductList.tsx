import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Image,
  App as AntdApp,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
  type TableColumnType,
  Input,
  type InputRef,
  DatePicker,
} from "antd";
import { getColorByTag } from "../constants/tagColors";
import type { Product } from "../types/IProduct";
import dayjs, { Dayjs } from "dayjs";
import { Category } from "../enums/category.enum";
import { mockProviders } from "../mocks/providers.mock";
import { mockTags } from "../mocks/tags.mock";
import { Status } from "../enums/status.enum";
import { useRef } from "react";
import type { FilterDropdownProps } from "antd/es/table/interface";
const { Text } = Typography;
const { RangePicker } = DatePicker;
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type DataIndex = keyof Product;

export const ProductList = ({
  products,
  setProducts,
  sendDataToProductForm,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sendDataToProductForm: (product: Product | null) => void;
}) => {
  const { message } = AntdApp.useApp();
  const searchInput = useRef<InputRef>(null);

  const handleConfirm = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    message.success("Product deleted successfully.");
  };

  const handleCancel = () => {
    message.info("Deletion canceled.");
  };

  const handleSearch = (confirm: FilterDropdownProps["confirm"]) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Product> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            color="default"
            variant="solid"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
            }}
          >
            OK
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const getColumnRangePickerProps = (
    dataIndex: DataIndex
  ): TableColumnType<Product> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <RangePicker
          minDate={dayjs()}
          value={selectedKeys[0]}
          style={{ marginBottom: 8 }}
          onChange={(dates) => {
            if (dates) {
              setSelectedKeys([dates]);
            } else {
              setSelectedKeys([]);
            }
          }}
        />
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            color="default"
            variant="solid"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
            }}
          >
            OK
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value, record) => {
      if (!value || (Array.isArray(value) && value.length === 1)) return true;
      const [start, end] = value as [Dayjs, Dayjs];
      if (!record[dataIndex]) return false;
      const recordDate = dayjs(record[dataIndex]);
      return (
        recordDate.isSameOrAfter(start, "day") &&
        recordDate.isSameOrBefore(end, "day")
      );
    },
  });

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Product name",
      key: "product-name",
      width: 300,
      ...getColumnSearchProps("name"),
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      filters: Object.entries(Category).map(([key, value]) => ({
        text: key,
        value,
      })),
      onFilter: (value, record) =>
        record.category.indexOf(value as string) === 0,
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      width: 150,
      filters: mockProviders.map((provider) => ({
        text: provider,
        value: provider,
      })),
      onFilter: (value, record) =>
        record.provider.indexOf(value as string) === 0,
      sorter: (a, b) => a.provider.localeCompare(b.provider),
    },
    {
      title: "Expired At",
      dataIndex: "expiredAt",
      key: "expiredAt",
      width: 150,
      ...getColumnRangePickerProps("expiredAt"),
      sorter: (a, b) =>
        dayjs(a.expiredAt).valueOf() - dayjs(b.expiredAt).valueOf(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Price",
      key: "price",
      width: 100,
      render: (_, record: Product) => <Text>$ {record.price.toFixed(2)}</Text>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Tags",
      key: "tags",
      width: 200,
      filters: mockTags.map((tag) => ({ text: tag, value: tag })),
      onFilter: (value, record) =>
        record.tags?.includes(value as string) as boolean,
      render: (_, record: Product) => (
        <>
          {record.tags?.map((tag, index) => (
            <Tag key={index} color={getColorByTag(tag)}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
      sorter: (a, b) => (a.tags?.length || 0) - (b.tags?.length || 0),
    },
    {
      title: "Status",
      width: 160,
      filters: Object.entries(Status).map(([key, value]) => ({
        text: key.replace(/([A-Z])/g, " $1"),
        value,
      })),
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
      render: (_, record: Product) => (
        <>
          <Badge
            color={record.status === "in_stock" ? "green" : "red"}
            text={record.status === "in_stock" ? "In Stock" : "Out of Stock"}
          />
        </>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record: Product) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "transparent" }}
            type="text"
            onClick={() => sendDataToProductForm(record)}
            icon={<EditOutlined style={{ fontSize: "20px" }} />}
          />
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
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
      showSorterTooltip={{ target: "full-header" }}
    />
  );
};
