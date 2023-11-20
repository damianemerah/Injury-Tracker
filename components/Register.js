"use client";

import { Button, Form, Input } from "antd";
import styles from "./AuthForm.module.css";
import Link from "next/link";
import toast from "react-hot-toast";
// import { UserContext } from "../context/UserContext";
// import { useRouter } from "next/navigation";
// import { useContext, useEffect } from "react";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const Register = () => {
  // const router = useRouter();
  const [form] = Form.useForm();
  // const { setUser } = useContext(UserContext);

  // useEffect(() => {
  //   console.log("effect", user);
  // }, [user]);

  const onFinish = async (values) => {
    const accountType = values.email ? "email" : "username";
    console.log("Received values of form: ", accountType);

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: values?.name,
        username: values?.username,
        email: values?.email,
        password: values.password,
        confirm: values.confirm,
        accountType,
      }),
      next: {
        cache: "no-store",
        revalidate: 3,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("🎈🎈🎈data", data.data);
      // setUser(data.data);
      toast.success("Account created successfully");
      router.push("/dashboard");
    } else {
      const error = await response.json();
      console.log("🎈🎈🎈error", error);
      toast.error(error.message);
    }
  };

  return (
    <Form
      {...formItemLayout}
      className={styles.auth_form}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "86",
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Name"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: "Please input your name!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
      <div className={styles.form_redirect}>
        <p>
          Already have an account{" "}
          <span>
            <Link href="/api/auth/login">login</Link>
          </span>
        </p>
      </div>
    </Form>
  );
};
export default Register;
