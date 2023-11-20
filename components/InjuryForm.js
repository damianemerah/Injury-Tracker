import { Form, Input, Select, Button, Space } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const { Option } = Select;
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const InjuryForm = forwardRef(function InjuryForm(
  { onFinish, onClick, saveInjury },
  ref
) {
  const [form] = Form.useForm();
  const [injuryNumber, setInjuryNumber] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleFinish = (values) => {
    if (onFinish) {
      onFinish(values);
    }
  };

  const resetFields = () => {
    form.resetFields();
  };

  const getFormValues = () => {
    return form.getFieldsValue();
  };

  const setFormValues = (values) => {
    form.setFieldsValue(values);
  };

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const inputInstance = (input) => {
    return form.getFieldInstance(input);
  };

  useImperativeHandle(ref, () => ({
    onFinish: handleFinish,
    onClick: handleButtonClick,
    resetFields,
    setFormValues,
    getFormValues,
    inputInstance,
    injuryNumber,
    setInjuryNumber,
    isEditing,
    setIsEditing,
  }));

  return (
    <Form form={form} name="myForm" onFinish={handleFinish} layout="vertical">
      {isEditing && (
        <p style={{ marginBottom: 15, fontWeight: "bold" }}>
          Editing injury: {injuryNumber}
        </p>
      )}
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input a description!" }]}
      >
        <Input.TextArea
          style={{ width: 300, height: 150 }}
          name="description"
        />
      </Form.Item>

      <Form.Item
        label="Body Part"
        name="part"
        rules={[{ required: true, message: "Please select a treatment!" }]}
      >
        <Select placeholder="Select body part" name="part">
          <Option value="default" disabled>
            -- Select Body Part --
          </Option>
          <Option value="Head-neck">Head & Neck</Option>
          <Option value="Chest-Stomach">Chest & Stomach</Option>
          <Option value="Lower-limb">Lower Limb</Option>
          <Option value="Upper-limb">Upper Limb</Option>
          <Option value="Back-Spine">Back & Spine</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Treatment"
        name="treatment"
        rules={[{ required: true, message: "Please select a treatment!" }]}
      >
        <Select placeholder="Select a treatment" name="treatment">
          <Option value="default" disabled>
            -- Select Treatment --
          </Option>
          <Option value="receive-treatment">Recieving treatment</Option>
          <Option value="no-treatment">No treatment</Option>
          <Option value="complete-treatment">Treatment completed</Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button htmlType="button" onClick={saveInjury}>
            Add Changes
          </Button>
          <Button type="primary" htmlType="submit" onClick={handleButtonClick}>
            Save Injury
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
});

export default InjuryForm;
