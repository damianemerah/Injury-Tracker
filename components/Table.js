import React, { use, useEffect, useState } from "react";
import { Table, DatePicker, Space, Button, Input } from "antd";
import { useInjury } from "./context/BodyMapContext";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
const isBetween = require("dayjs/plugin/isBetween");

const { RangePicker } = DatePicker;

const ReporterTable = () => {
  const {
    injuries,
    userId,
    canvas,
    setInjurySaveType,
    setCircleId,
    setInjuryCount,
  } = useInjury();
  const router = usePathname();

  let data;
  let injuryList;
  let injuryItem = [];

  const baseColumns = [
    {
      title: "Injury",
      dataIndex: "injury",
      sorter: (a, b) => {
        return a.injury.localeCompare(b.injury);
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search injury"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="small"
              onClick={() => confirm()}
            >
              Search
            </Button>
            <Button size="small" onClick={() => clearFilters()}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        // Customize the search logic based on your requirements
        return record.injury.toLowerCase().includes(value.toLowerCase());
      },
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Injury Date",
      dataIndex: "injuryDate",
      sorter: (a, b) => new Date(a.injuryDate) - new Date(b.injuryDate),
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div
            style={{
              padding: 8,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RangePicker
              style={{ marginBottom: 10 }}
              value={selectedKeys[0] ? [selectedKeys[0], selectedKeys[1]] : []}
              onChange={(dates) => {
                setSelectedKeys(dates);
              }}
              onPressEnter={() => confirm()}
              onReset={() => clearFilters()}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && clearFilters()}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
            </Space>
          </div>
        );
      },
      onFilter: (value, record) => {
        // Custom filter logic based on the selected date range
        dayjs.extend(isBetween);
        const startDate = dayjs(value[0])
          .startOf("day")
          .format("YYYY-MM-DD HH:mm");
        const endDate = dayjs(value[1]).endOf("day").format("YYYY-MM-DD HH:mm");
        const injuryDate = dayjs(record.injuryDate).format("YYYY-MM-DD HH:mm");

        return dayjs(injuryDate).isBetween(startDate, endDate, null, "[)");
      },
    },
    {
      title: "Reporter",
      dataIndex: "reporter",
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
    },

    {
      title: "Description",
      dataIndex: "description",
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              canvas.clear();
              const injury = injuryItem.find((data) => data.id === record.key);
              const canvasData = JSON.parse(injury.bodyMap);
              canvas.loadFromJSON(canvasData);
              canvas.renderAll();
              canvas.getObjects().forEach((obj) => {
                obj.parentId = injury.parentId;
                obj.id = obj.id;
              });
              setInjuryCount(canvas.getObjects().length);
              setInjurySaveType("update");
              setCircleId(canvasData.objects.length);
            }}
          >
            Edit Group
          </a>
        </Space>
      ),
    },
  ];

  // filter out the action column if the user is on the report page
  const columns =
    router !== "/report"
      ? baseColumns.filter((index) => index.dataIndex !== "action")
      : baseColumns;

  if (router == "/report") {
    injuryList = injuries.filter((injury) => {
      return injury.reporter.id === userId;
    });
  } else {
    injuryList = [...injuries];
  }

  injuryList.forEach((injury) => {
    for (let i = 0; i < injury.injuryItem.length; i++) {
      injury.injuryItem[i].reporter = injury.reporter.name;
      injury.injuryItem[i].parentId = injury.id;
      injuryItem.push(injury.injuryItem[i]);
    }
  });

  if (injuryItem != []) {
    data = injuryItem.map((injury) => {
      return {
        key: injury.id,
        reporter: injury.reporter,
        injury: injury.bodyPart,
        injuryDate: injury.injuryDate,
        createdAt: injury.createdAt,
        description: injury.description,
        parentId: injury.parentId,
      };
    });
  }

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return <Table columns={columns} dataSource={data} onChange={onChange} />;
};

export default ReporterTable;
