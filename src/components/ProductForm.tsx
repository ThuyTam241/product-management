import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Upload,
  type InputRef,
  type UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import type { Product, Status } from "../types/IProduct";

let index = 0;

export const ProductForm = ({
  initialValue = null,
  isModalOpen,
  setIsModalOpen,
  onSubmitForm,
}: {
  initialValue: Product | null;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmitForm: (value: Product) => void;
}) => {
  const [tagList, setTagList] = useState<string[]>([
    "hot",
    "new",
    "sale",
    "bestseller",
    "business",
    "skincare",
  ]);
  const [tagName, setTagName] = useState<string>("");
  const form = Form.useForm<Product>()[0];
  const inputRef = useRef<InputRef>(null);
  const [fileList, setFileList] = useState<UploadFile[]>();

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setTagList([...tagList, tagName || `New item ${index++}`]);
    setTagName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const categories = [
    "electronics",
    "footwear",
    "computers",
    "audio",
    "wearables",
    "food",
    "cameras",
    "accessories",
    "cosmetics",
    "pharmaceuticals",
    "nutrition",
    "personal_care",
  ].map((it) => ({ value: it, label: it }));

  const providers = [
    "Apple Inc.",
    "Samsung",
    "Nike",
    "Sony",
    "GoPro",
    "Razer",
    "Lenovo",
    "Yakult Vietnam",
    "GSK",
    "Beiersdorf",
    "Abbott",
    "Colgate-Palmolive",
  ].map((it) => ({
    value: it,
    label: it,
  }));

  const statuses: Status[] = ["in_stock", "out_of_stock"];

  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue({
        ...initialValue,
        expiredAt: initialValue.expiredAt && dayjs(initialValue.expiredAt),
      });
      setFileList([
        {
          uid: "-1",
          name: `${initialValue.thumbnail?.split("/").pop()}`,
          status: "done",
          url: `${initialValue.thumbnail}`,
          thumbUrl: `${initialValue.thumbnail}`,
        },
      ]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialValue]);

  return (
    <Modal
      title={
        initialValue?.id ? `Update ${initialValue.name}` : "Create new product"
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        labelAlign="left"
        onFinish={onSubmitForm}
      >
        <Form.Item label="Thumbnail" name="thumbnail">
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            listType="picture"
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Provider"
          name="provider"
          rules={[{ required: true }]}
        >
          <Select placeholder="select your provider">
            {providers.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Expired At" name="expiredAt">
          <DatePicker minDate={dayjs()} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true }]}
        >
          <Select placeholder="select your category">
            {categories.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} placeholder="Enter your quantity" />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} placeholder="Enter your price" />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select
            mode="multiple"
            placeholder="Assign tags"
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={tagName}
                    onChange={onNameChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
            options={tagList.map((tag) => ({ label: tag, value: tag }))}
          />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Radio.Group>
            {statuses.map((status) => (
              <Radio key={status} value={status}>
                {status.replace(/_/g, " ")}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Space
          size="middle"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(false)}
            style={{ borderColor: "#d9d9d9", color: "rgba(0, 0, 0, 0.88)" }}
          >
            Cancel
          </Button>
          <Button color="default" variant="solid" htmlType="submit">
            Save
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};
