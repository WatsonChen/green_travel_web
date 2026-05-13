'use client';

import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <Title level={1} className="text-center mb-8">關於我們</Title>
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <Paragraph className="text-lg leading-relaxed">
          Green Travel 成立於 2025 年，致力於推廣永續旅遊與深度文化體驗。我們相信旅遊不僅僅是觀光，更是一場與當地文化、自然環境的深度對話。
        </Paragraph>
        <Paragraph className="text-lg leading-relaxed">
          我們的團隊由一群熱愛旅遊、關心環境的專業人士組成，為您精心策劃每一趟旅程，確保您在享受美好假期的同時，也能為地球盡一份心力。
        </Paragraph>
        <Paragraph className="text-lg leading-relaxed">
          無論是國內的秘境探索，還是國外的文化巡禮，Green Travel 都是您最值得信賴的夥伴。
        </Paragraph>
      </div>
    </div>
  );
}
