"use client";

import React from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import {
  BellOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { announcements, AnnouncementProps } from "../data/announcements";

const { Title, Text } = Typography;

const AnnouncementSection: React.FC = () => {
  // 排序：置頂的在前面，然後按日期排序
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  });

  const getIcon = (type: AnnouncementProps["type"]) => {
    switch (type) {
      case "important":
        return <BellOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />;
      case "promotional":
        return <GiftOutlined style={{ fontSize: "24px", color: "#97c618" }} />;
      case "general":
        return (
          <InfoCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        );
    }
  };

  const getCardStyle = (type: AnnouncementProps["type"], isPinned: boolean) => {
    const baseStyle: React.CSSProperties = {
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
        ...baseStyle,
        borderLeft: "4px solid #97c618",
        background:
          "linear-gradient(135deg, rgba(151, 198, 24, 0.12) 0%, rgba(255, 255, 255, 0.85) 100%)",
        boxShadow: `
          0 2px 8px rgba(151, 198, 24, 0.08),
          0 4px 16px rgba(151, 198, 24, 0.12),
          0 8px 32px rgba(151, 198, 24, 0.16)
        `,
      };
    }

    return {
      ...baseStyle,
      boxShadow: `
        0 2px 4px rgba(0, 0, 0, 0.02),
        0 4px 12px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.06)
      `,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div
      className="py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8fafb 0%, #ffffff 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(151, 198, 24, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
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
          <Text
            type="secondary"
            style={{
              fontSize: "18px",
              fontWeight: 400,
            }}
          >
            掌握最新優惠活動與重要資訊
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {sortedAnnouncements.map((announcement, index) => (
            <Col
              xs={24}
              md={12}
              lg={6}
              key={announcement.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <Card
                hoverable
                style={getCardStyle(announcement.type, announcement.isPinned)}
                styles={{ body: { padding: "24px" } }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = announcement.isPinned
                    ? `
                      0 4px 16px rgba(151, 198, 24, 0.12),
                      0 8px 32px rgba(151, 198, 24, 0.18),
                      0 16px 48px rgba(151, 198, 24, 0.24)
                    `
                    : `
                      0 4px 8px rgba(0, 0, 0, 0.04),
                      0 8px 24px rgba(0, 0, 0, 0.08),
                      0 16px 48px rgba(0, 0, 0, 0.12)
                    `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = announcement.isPinned
                    ? `
                      0 2px 8px rgba(151, 198, 24, 0.08),
                      0 4px 16px rgba(151, 198, 24, 0.12),
                      0 8px 32px rgba(151, 198, 24, 0.16)
                    `
                    : `
                      0 2px 4px rgba(0, 0, 0, 0.02),
                      0 4px 12px rgba(0, 0, 0, 0.04),
                      0 8px 24px rgba(0, 0, 0, 0.06)
                    `;
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      background:
                        announcement.type === "important"
                          ? "rgba(255, 77, 79, 0.12)"
                          : announcement.type === "promotional"
                          ? "rgba(151, 198, 24, 0.12)"
                          : "rgba(24, 144, 255, 0.12)",
                      boxShadow:
                        announcement.type === "important"
                          ? "0 2px 8px rgba(255, 77, 79, 0.15)"
                          : announcement.type === "promotional"
                          ? "0 2px 8px rgba(151, 198, 24, 0.15)"
                          : "0 2px 8px rgba(24, 144, 255, 0.15)",
                    }}
                  >
                    {getIcon(announcement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Title
                        level={5}
                        style={{
                          margin: 0,
                          fontSize: "17px",
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {announcement.title}
                      </Title>
                      {announcement.isPinned && (
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
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(announcement.publishDate)}
                    </Text>
                  </div>
                </div>

                <Text
                  style={{
                    display: "block",
                    marginBottom: 20,
                    color: "#595959",
                    lineHeight: 1.7,
                    fontSize: "14px",
                  }}
                >
                  {announcement.content}
                </Text>

                {announcement.link && (
                  <Link href={announcement.link}>
                    <Button
                      type="text"
                      size="small"
                      style={{
                        padding: 0,
                        height: "auto",
                        color: "#97c618",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                      icon={<RightOutlined />}
                      iconPosition="end"
                      className="hover:translate-x-1 transition-transform duration-300"
                    >
                      {announcement.linkText || "查看詳情"}
                    </Button>
                  </Link>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AnnouncementSection;
