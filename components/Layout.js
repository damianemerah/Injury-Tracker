"use client";

import React, { useState, useEffect } from "react";
import { FileOutlined, BarChartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Space, Button, Image } from "antd";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useUserContext } from "./context/UserContext";
import { usePathname } from "next/navigation";

const { Header, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem(
    <Link href={"/dashboard"}>Dashboard</Link>,
    "/dashboard",
    <BarChartOutlined />
  ),
  getItem(
    <Link href={"/report"}>Report Injury</Link>,
    "/report",
    <FileOutlined />
  ),
];

const App = ({ children }) => {
  const pathname = usePathname();
  const { user: auth0User, error, isLoading } = useUser();
  const { user } = useUserContext();
  const [selectedMenu, setSelectedMenu] = useState(pathname);

  const [collapsed, setCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleSelectedMenu = (e) => {
    setSelectedMenu(e.key);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={isSmallScreen ? true : collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[selectedMenu]}
          mode="inline"
          items={items}
          onClick={handleSelectedMenu}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              padding: "0 24px",
              background: colorBgContainer,
              backgroundRepeat: "no-repeat",

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>
              <span>Pain</span>
              <span style={{ color: "orange" }}>Point</span>
            </h1>
            {user ? (
              <Space>
                <span style={{ textTransform: "capitalize" }}>{user.name}</span>
                <Image
                  src={user?.picture ? user.picture : auth0User.picture}
                  alt={user.name}
                  width={35}
                  height={35}
                />
                <Space>
                  <a href="/api/auth/logout">Logout</a>
                </Space>
              </Space>
            ) : (
              <Button>
                <a href="/api/auth/login">Login</a>
              </Button>
            )}
          </div>
        </Header>
        {children}
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
