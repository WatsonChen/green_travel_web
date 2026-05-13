"use client";

import React from "react";
import { Typography, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop")',
        }}
      >
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(151, 198, 24, 0.25) 100%)",
          }}
        />
      </div>

      {/* Logo Area */}
      <div className="absolute top-6 left-6 z-20 animate-fade-in">
        <div
          className="rounded-xl px-4 py-2"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow:
              "0 4px 16px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.08)",
          }}
        >
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 animate-fade-in-up">
        <Title
          level={1}
          style={{
            color: "white",
            marginBottom: 24,
            fontSize: "4rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          探索世界，發現美好
        </Title>
        <Paragraph
          style={{
            color: "rgba(255, 255, 255, 0.95)",
            fontSize: "1.375rem",
            maxWidth: 700,
            marginBottom: 32,
            lineHeight: 1.6,
            fontWeight: 400,
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          無論是國內輕旅行還是國外深度遊，我們都能為您創造難忘的回憶。
          立即開始您的旅程！
        </Paragraph>

        <div className="flex gap-4">
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            iconPosition="end"
            style={{
              height: "52px",
              padding: "0 32px",
              fontSize: "16px",
              fontWeight: 600,
              backgroundColor: "var(--color-main)",
              borderColor: "var(--color-main)",
              borderRadius: "26px",
              boxShadow: `
                0 4px 12px rgba(151, 198, 24, 0.25),
                0 8px 24px rgba(151, 198, 24, 0.2),
                0 12px 40px rgba(151, 198, 24, 0.15)
              `,
            }}
            className="hover:scale-105 transition-transform duration-300"
          >
            探索行程
          </Button>
          <Button
            size="large"
            style={{
              height: "52px",
              padding: "0 32px",
              fontSize: "16px",
              fontWeight: 600,
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              borderColor: "rgba(255, 255, 255, 0.35)",
              color: "white",
              borderRadius: "26px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            }}
            className="hover:bg-white/25 transition-all duration-300"
          >
            了解更多
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
