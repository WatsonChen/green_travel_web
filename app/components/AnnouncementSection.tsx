"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button, Spin } from "antd";
import {
  BellOutlined,
  GiftOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import api from "../lib/api";

const { Title, Text } = Typography;

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  publish_date: string;
}

type DisplayType = "important" | "general" | "promotional";

function getDisplayType(priority: string): DisplayType {
  if (priority === "high") return "important";
  if (priority === "low") return "promotional";
  return "general";
}

function getIcon(type: DisplayType) {
  switch (type) {
    case "important":
      return <BellOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />;
    case "promotional":
      return <GiftOutlined style={{ fontSize: "24px", color: "#97c618" }} />;
    case "general":
      return <InfoCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />;
  }
}

function getCardStyle(type: DisplayType, isPinned: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    height: "100%",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };
  if (isPinned) {
    return {
      ...base,
      borderLeft: "4px solid #97c618",
      background: "linear-gradient(135deg, rgba(151, 198, 24, 0.12) 0%, rgba(255, 255, 255, 0.85) 100%)",
      boxShadow: "0 2px 8px rgba(151, 198, 24, 0.08), 0 4px 16px rgba(151, 198, 24, 0.12), 0 8px 32px rgba(151, 198, 24, 0.16)",
    };
  }
  return {
    ...base,
    boxShadow: "0 2px 4px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const AnnouncementSection: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/announcements")
      .then(({ data }) => setAnnouncements(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (announcements.length === 0) return null;

  const sorted = [...announcements].sort((a, b) => {
    const pa = a.priority === "high" ? 0 : 1;
    const pb = b.priority === "high" ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
  });

  return (
    <div
      className="py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f8fafb 0%, #ffffff 100%)" }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(151, 198, 24, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <Title
            level={2}
            style={{
              marginBottom: 12,
              fontSize: "2.5rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #2c3e50 0%, #97c618 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            📢 最新公告
          </Title>
          <Text type="secondary" style={{ fontSize: "18px", fontWeight: 400 }}>
            掌握最新優惠活動與重要資訊
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {sorted.map((announcement, index) => {
            const type = getDisplayType(announcement.priority);
            const isPinned = announcement.priority === "high";
            return (
              <Col
                xs={24}
                md={12}
                lg={6}
                key={announcement.id}
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <Card
                  hoverable
                  style={getCardStyle(type, isPinned)}
                  styles={{ body: { padding: "24px" } }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = isPinned
                      ? "0 4px 16px rgba(151, 198, 24, 0.12), 0 8px 32px rgba(151, 198, 24, 0.18), 0 16px 48px rgba(151, 198, 24, 0.24)"
                      : "0 4px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = isPinned
                      ? "0 2px 8px rgba(151, 198, 24, 0.08), 0 4px 16px rgba(151, 198, 24, 0.12), 0 8px 32px rgba(151, 198, 24, 0.16)"
                      : "0 2px 4px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)";
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="p-2.5 rounded-xl"
                      style={{
                        background:
                          type === "important"
                            ? "rgba(255, 77, 79, 0.12)"
                            : type === "promotional"
                            ? "rgba(151, 198, 24, 0.12)"
                            : "rgba(24, 144, 255, 0.12)",
                        boxShadow:
                          type === "important"
                            ? "0 2px 8px rgba(255, 77, 79, 0.15)"
                            : type === "promotional"
                            ? "0 2px 8px rgba(151, 198, 24, 0.15)"
                            : "0 2px 8px rgba(24, 144, 255, 0.15)",
                      }}
                    >
                      {getIcon(type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Title
                          level={5}
                          style={{ margin: 0, fontSize: "17px", fontWeight: 600, lineHeight: 1.4 }}
                        >
                          {announcement.title}
                        </Title>
                        {isPinned && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#97c618",
                              fontWeight: 700,
                              backgroundColor: "rgba(151, 198, 24, 0.18)",
                              padding: "4px 12px",
                              borderRadius: "14px",
                              border: "1.5px solid rgba(151, 198, 24, 0.4)",
                              boxShadow: "0 2px 6px rgba(151, 198, 24, 0.2)",
                            }}
                          >
                            置頂
                          </span>
                        )}
                      </div>
                      {announcement.publish_date && (
                        <Text type="secondary" style={{ fontSize: "13px", fontWeight: 500 }}>
                          {formatDate(announcement.publish_date)}
                        </Text>
                      )}
                    </div>
                  </div>

                  <Text
                    style={{
                      display: "block",
                      color: "#595959",
                      lineHeight: 1.7,
                      fontSize: "14px",
                    }}
                  >
                    {announcement.content}
                  </Text>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default AnnouncementSection;
