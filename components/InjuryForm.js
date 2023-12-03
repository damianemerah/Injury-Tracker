import { Form, Input, Select, Button, Space, DatePicker } from "antd";
import { useInjury } from "@/components/context/BodyMapContext";
import { useEffect } from "react";
import dayjs from "dayjs";

const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const InjuryForm = function InjuryForm({ addInjuryDetail }) {
  const { circleId, isEditing, saveInjury, form, onChange, canvas } =
    useInjury();

  return (
    <Form form={form} name="myForm" layout="vertical">
      {isEditing && (
        <p
          style={{ marginBottom: 15, fontWeight: "bold", color: "yellowgreen" }}
        >
          Viewing injury: {circleId}
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
        name="bodyPart"
        rules={[{ required: true, message: "Please select a body part!" }]}
      >
        <Select placeholder="Select body part" name="bodyPart">
          <Option value="default" disabled>
            -- Select Body Part --
          </Option>
          <Option value="Head">Head</Option>
          <Option value="Neck">Neck</Option>
          <Option value="Shoulder">Shoulder</Option>
          <Option value="Arm">Arm</Option>
          <Option value="Hand">Hand</Option>
          <Option value="Torso">Torso</Option>
          <Option value="Leg">Leg</Option>
          <Option value="Foot">Foot</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Injury Start-date"
        name="date"
        rules={[{ required: true, message: "Please select a date!" }]}
      >
        <DatePicker
          onChange={onChange}
          format="YYYY/MM/DD HH:mm"
          showTime={{ format: "HH:mm" }}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button htmlType="button" onClick={addInjuryDetail}>
            Add Changes
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default InjuryForm;
