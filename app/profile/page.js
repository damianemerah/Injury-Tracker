"use client";

import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Avatar,
  Space,
} from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const Profile = () => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);

  const onFinish = (values) => {
    // Handle form submission logic (update user name, picture, etc.)
    console.log("Form values:", values);
    // You can make an API call to update user information here
    message.success("Profile updated successfully");
  };

  const onChangeAvatar = (info) => {
    if (info.file.status === "done") {
      // Update the avatar state with the file response or URL
      setAvatar(info.file.response || info.file.thumbUrl);
    }
  };

  const uploadProps = {
    name: "avatar",
    action: "/api/upload", // Replace with your upload API endpoint
    headers: {
      authorization: "authorization-text",
    },
    onChange: onChangeAvatar,
  };

  return (
    <Space
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="User Profile">
        <Form
          form={form}
          name="profileForm"
          initialValues={{ name: "John Doe" }} // Set initial values here
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Profile Picture">
            <Upload {...uploadProps} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
            {avatar && <Avatar size={64} src={avatar} />}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Injury Stats" style={{ width: "100%" }}>
        {/* Display injury stats here */}
        <p>Total Injuries: 5</p>
        <p>Active Injuries: 2</p>
        {/* Add more stats as needed */}
      </Card>
    </Space>
  );
};

export default Profile;
