"use client";

import React from "react";
import { Card, Tag, Typography, Button } from "antd";
import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Meta } = Card;
const { Text } = Typography;

export interface ItineraryProps {
  id: string;
  title: string;
  image: string;
  price: number;
  days: number;
  location: string;
  tags: string[];
  category: "domestic" | "international";
}

const ItineraryCard: React.FC<{ data: ItineraryProps }> = ({ data }) => {
  return (
    <Link href={`/itinerary/${data.id}`} className="block h-full">
      <Card
        hoverable
        cover={
          <div className="h-56 overflow-hidden relative group">
            <img
              alt={data.title}
              src={data.image}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              style={{
                filter: "brightness(0.95)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        }
        className="h-full flex flex-col overflow-hidden rounded-2xl transition-all duration-400"
        style={{
          boxShadow: `
            0 2px 4px rgba(0, 0, 0, 0.04),
            0 4px 12px rgba(0, 0, 0, 0.06),
            0 8px 24px rgba(0, 0, 0, 0.08)
          `,
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: "24px",
        }}
        styles={{
          body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          },
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `
            0 4px 8px rgba(0, 0, 0, 0.06),
            0 8px 24px rgba(0, 0, 0, 0.1),
            0 16px 48px rgba(0, 0, 0, 0.14)
          `;
          e.currentTarget.style.transform = "translateY(-8px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `
            0 2px 4px rgba(0, 0, 0, 0.04),
            0 4px 12px rgba(0, 0, 0, 0.06),
            0 8px 24px rgba(0, 0, 0, 0.08)
          `;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div className="mb-3">
          {data.tags.map((tag) => (
            <Tag
              key={tag}
              className="mr-1 mb-1 border-none"
              style={{
                background: "linear-gradient(135deg, #97c618 0%, #7fa515 100%)",
                color: "white",
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: "14px",
                fontSize: "12px",
                boxShadow: "0 2px 8px rgba(151, 198, 24, 0.3)",
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
        <Meta
          title={
            <div
              className="text-lg font-bold line-clamp-2 mb-1"
              title={data.title}
              style={{
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: 1.4,
                color: "#1a1a1a",
              }}
            >
              {data.title}
            </div>
          }
          description={
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-gray-600">
                <EnvironmentOutlined
                  className="mr-2"
                  style={{ fontSize: "16px", color: "#97c618" }}
                />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  {data.location}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockCircleOutlined
                  className="mr-2"
                  style={{ fontSize: "16px", color: "#97c618" }}
                />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  {data.days} 天
                </span>
              </div>
            </div>
          }
        />
        <div
          className="mt-auto pt-4 flex items-center justify-between"
          style={{
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <div>
            <Text
              type="secondary"
              className="text-xs"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              每人
            </Text>
            <div
              className="text-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #97c618 0%, #7fa515 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              NT$ {data.price.toLocaleString()}{" "}
              <span className="text-xs text-gray-400 font-normal">起</span>
            </div>
          </div>
          <Button
            type="primary"
            shape="round"
            style={{
              backgroundColor: "#97c618",
              borderColor: "#97c618",
              fontWeight: 600,
              height: "40px",
              padding: "0 24px",
              boxShadow: `
                0 2px 6px rgba(151, 198, 24, 0.2),
                0 4px 12px rgba(151, 198, 24, 0.25),
                0 6px 20px rgba(151, 198, 24, 0.15)
              `,
            }}
            className="hover:scale-105 transition-transform duration-300"
          >
            查看詳情
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default ItineraryCard;
