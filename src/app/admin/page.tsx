'use client';

/**
 * Role: 어드민 대시보드 — 텍스트, 이미지, AI 프롬프트 수정 및 저장
 * Key Features: /api/content GET/POST 연동, /api/upload 이미지 업로드
 * Dependencies: admin.module.css, /api/content/route.ts, /api/upload/route.ts
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './admin.module.css';

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ContentData {
  hero: { title: string; subtitle: string; imageUrl: string };
  services: Service[];
  aiPrompt: string;
}

export default function AdminPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<'idle' | 'success' | 'error'>('idle');
  // 각 이미지 슬롯별 업로드 상태 관리
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch(() => setSaveResult('error'));
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    setSaveResult('idle');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      setSaveResult(res.ok ? 'success' : 'error');
    } catch {
      setSaveResult('error');
    } finally {
      setIsSaving(false);
    }
  };

  /** 이미지 업로드 후 해당 슬롯의 imageUrl 업데이트 */
  const handleImageUpload = async (
    file: File,
    target: 'hero' | { serviceIndex: number }
  ) => {
    const key = target === 'hero' ? 'hero' : `service-${(target as { serviceIndex: number }).serviceIndex}`;
    setUploadingKey(key);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || '업로드 실패');
        return;
      }

      // 업로드된 URL을 content 상태에 반영 (저장은 별도 버튼으로)
      if (!content) return;
      if (target === 'hero') {
        setContent({ ...content, hero: { ...content.hero, imageUrl: data.url } });
      } else {
        const updated = [...content.services];
        updated[(target as { serviceIndex: number }).serviceIndex].imageUrl = data.url;
        setContent({ ...content, services: updated });
      }
      setSaveResult('idle');
    } catch {
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingKey(null);
    }
  };

  if (!content) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>서비스 관리자 설정</h1>
        <button className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </header>

      {saveResult === 'success' && (
        <div className={styles.toast} data-type="success">저장되었습니다.</div>
      )}
      {saveResult === 'error' && (
        <div className={styles.toast} data-type="error">저장에 실패했습니다. 다시 시도해주세요.</div>
      )}

      <main className={styles.adminMain}>
        {/* 히어로 섹션 */}
        <section className={styles.configSection}>
          <h2>히어로 섹션</h2>
          <div className={styles.inputGroup}>
            <label>메인 문구</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => {
                setContent({ ...content, hero: { ...content.hero, title: e.target.value } });
                setSaveResult('idle');
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>서브 문구</label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) => {
                setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } });
                setSaveResult('idle');
              }}
            />
          </div>
          <ImageUploadField
            label="배경 이미지"
            imageUrl={content.hero.imageUrl}
            isUploading={uploadingKey === 'hero'}
            onFileSelect={(file) => handleImageUpload(file, 'hero')}
          />
        </section>

        {/* 서비스 카드 이미지 */}
        <section className={styles.configSection}>
          <h2>서비스 카드 이미지</h2>
          {content.services.map((service, i) => (
            <div key={service.id} className={styles.serviceImageRow}>
              <span className={styles.serviceLabel}>{service.title}</span>
              <ImageUploadField
                label=""
                imageUrl={service.imageUrl}
                isUploading={uploadingKey === `service-${i}`}
                onFileSelect={(file) => handleImageUpload(file, { serviceIndex: i })}
              />
            </div>
          ))}
        </section>

        {/* AI 프롬프트 */}
        <section className={styles.configSection}>
          <h2>AI 프롬프트 설정 (OpenRouter)</h2>
          <div className={styles.inputGroup}>
            <label>기본 프롬프트</label>
            <textarea
              rows={5}
              value={content.aiPrompt}
              onChange={(e) => {
                setContent({ ...content, aiPrompt: e.target.value });
                setSaveResult('idle');
              }}
            />
          </div>
          <p className={styles.helpText}>이 프롬프트는 로봇의 &apos;성격&apos;과 &apos;응대 방식&apos;을 정의합니다.</p>
        </section>
      </main>
    </div>
  );
}

/** 이미지 미리보기 + 파일 업로드 버튼 컴포넌트 */
function ImageUploadField({
  label,
  imageUrl,
  isUploading,
  onFileSelect,
}: {
  label: string;
  imageUrl: string;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.imageUploadField}>
      {label && <span className={styles.imageLabel}>{label}</span>}
      <div className={styles.imagePreviewWrapper}>
        <Image
          src={imageUrl}
          alt="preview"
          fill
          style={{ objectFit: 'cover' }}
          // 캐시 없이 항상 최신 이미지 표시
          unoptimized
        />
        {isUploading && (
          <div className={styles.uploadingOverlay}>업로드 중...</div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          // 같은 파일 재선택 가능하도록 초기화
          e.target.value = '';
        }}
      />
      <button
        className={styles.uploadButton}
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? '업로드 중...' : '이미지 교체'}
      </button>
    </div>
  );
}
