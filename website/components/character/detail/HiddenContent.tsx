// Copyright 2025 The ESAP Project
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HiddenProfile } from "@/types/hidden-profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HiddenContentProps {
  profile: HiddenProfile;
  characterColor: string;
}

/**
 * 隐藏属性内容渲染组件
 * 根据不同的内容类型渲染对应的展示形式
 */
export function HiddenContent({ profile, characterColor }: HiddenContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("characters.detail.hiddenProfile");

  // 渲染文本内容
  const renderTextContent = () => {
    if (!profile.content) return null;

    const contents = Array.isArray(profile.content)
      ? profile.content
      : [profile.content];

    return (
      <div className="space-y-6">
        {contents.map((text, index) => (
          <motion.p
            key={index}
            className="text-lg md:text-xl leading-relaxed text-foreground/90"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {text}
          </motion.p>
        ))}
      </div>
    );
  };

  // 渲染图片内容
  const renderImages = () => {
    if (!profile.images || profile.images.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {profile.images.map((imageUrl, index) => (
          <motion.div
            key={index}
            className="relative aspect-video rounded-xl overflow-hidden bg-muted"
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            <Image
              src={imageUrl}
              alt={t("ui.imageAlt", { index: index + 1 })}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  // 渲染互动内容占位符
  const renderInteractive = () => {
    if (!profile.interactive) return null;

    return (
      <motion.div
        className="mt-8 p-8 rounded-xl border-2 border-dashed border-border bg-muted/50 text-center"
        initial={
          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-muted-foreground">
          {t("ui.interactive.label", { type: profile.interactive.type })}
        </p>
        <p className="text-sm text-muted-foreground/70 mt-2">
          {t("ui.interactive.developing")}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {/* 标题 */}
      {profile.title && (
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            color: profile.textColor || characterColor,
          }}
        >
          {profile.title}
        </motion.h2>
      )}

      {/* 装饰线 */}
      <motion.div
        className="w-24 h-1 rounded-full mx-auto mb-12"
        initial={shouldReduceMotion ? { width: 96 } : { width: 0 }}
        animate={{ width: 96 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          backgroundColor: characterColor,
        }}
      />

      {/* 根据类型渲染不同内容 */}
      {profile.type === "text" && renderTextContent()}

      {profile.type === "image" && renderImages()}

      {profile.type === "mixed" && (
        <>
          {renderTextContent()}
          {renderImages()}
        </>
      )}

      {profile.type === "interactive" && (
        <>
          {renderTextContent()}
          {renderInteractive()}
        </>
      )}
    </div>
  );
}
