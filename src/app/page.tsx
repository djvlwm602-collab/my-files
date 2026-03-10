/**
 * Role: 휴머노이드 로봇 랜딩 페이지 메인 컴포넌트
 * Key Features: 히어로, 서비스 카드, 요금제 — data/content.json에서 동적으로 컨텐츠 로드
 * Dependencies: data/content.json (fs 직접 읽기), page.module.css
 */

import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import styles from './page.module.css';

// 어드민 수정 사항을 반영하기 위해 빌드 시점에 정적 생성
// export const dynamic = 'force-dynamic'; // 정적 배포를 위해 주석 처리

/** content.json 타입 정의 */
interface ContentData {
  hero: { title: string; subtitle: string; imageUrl: string };
  services: { id: string; title: string; description: string; imageUrl: string }[];
  pricing: {
    badge: string;
    planName: string;
    price: string;
    unit: string;
    features: string[];
    ctaText: string;
  };
}

/** 서버 사이드에서 컨텐츠 JSON 직접 읽기 */
function getContent(): ContentData {
  const filePath = path.join(process.cwd(), 'data', 'content.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export default function Home() {
  const content = getContent();
  const { hero, services, pricing } = content;
  // GitHub Pages는 /my-files 서브경로에 배포되므로 이미지 src에 basePath를 수동으로 접두사 적용
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <main className={styles.main}>
      {/* 히어로 섹션 */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg}>
          <Image
            src={basePath + hero.imageUrl}
            alt="Humanoid Robot Household"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="vignette-dim" />
        </div>
        <div className={`${styles.heroContent} fade-in`}>
          <h1 className={styles.mainTitle}>{hero.title}</h1>
          <p className={styles.subTitle}>{hero.subtitle}</p>
        </div>
      </section>

      {/* 서비스 소개 섹션 (3단 카드) */}
      <section className={styles.serviceSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>하는 일도, 즐거움도 진심이니까</h2>
          </div>
          <div className={styles.cardGrid}>
            {services.map((service) => (
              <div key={service.id} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  <Image src={basePath + service.imageUrl} alt={service.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.cardContent}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section className={styles.pricingSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>합리적인 가격으로 누리는 여유</h2>
            <p className={styles.sectionSubTitle}>가족의 행복을 위해 꼭 필요한 투자입니다.</p>
          </div>
          <div className={styles.pricingWrapper}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <span className={styles.planBadge}>{pricing.badge}</span>
                <h3 className={styles.planName}>{pricing.planName}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.priceAmount}>{pricing.price}</span>
                  <span className={styles.priceUnit}>{pricing.unit}</span>
                </div>
              </div>
              <ul className={styles.planFeatures}>
                {pricing.features.map((feature, i) => (
                  <li key={i}>✓ {feature}</li>
                ))}
              </ul>
              <button className={styles.pricingButton}>{pricing.ctaText}</button>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2026 Humanoid Home Service. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
