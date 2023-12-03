"use client";

import Image from "next/image";
import Head from "next/head";
import { Space, Typography, Card, Statistic, Layout, theme } from "antd";
import { FieldTimeOutlined } from "@ant-design/icons";
import InjuryTable from "@/components/Table";
import { InjuryChart } from "@/components/InjuryChart";

const { Content } = Layout;

export default function ProfileClient() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Content
      style={{
        margin: "0 16px",
      }}
    >
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
        }}
      >
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Overview
        </Typography.Title>
        <Typography.Title level={4}>Overview</Typography.Title>
        <Space style={{ marginBottom: 30 }}>
          <DashboardCard
            icon={
              <FieldTimeOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0, 255, 0, 0.25",
                  borderRadius: 50,
                  padding: 10,
                }}
              />
            }
            title={"This Week"}
            value={1234}
          />
          <DashboardCard
            icon={
              <FieldTimeOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255, 0, 0, 0.25",
                  borderRadius: 50,
                  padding: 10,
                }}
              />
            }
            title={"Last Month"}
            value={1234}
          />
        </Space>
        <Typography.Title level={4}>Last Reported Injury:</Typography.Title>
      </div>
      <div
        style={{
          padding: 24,
          background: colorBgContainer,
        }}
      >
        <InjuryChart />
      </div>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
        }}
      >
        <InjuryTable />
      </div>
    </Content>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card style={{ borderWidth: 3 }}>
      <Space>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
