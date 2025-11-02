// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/ui";

export function ContactPlaceholder() {
  const platforms: Array<{ name: string; icon: IconName; status: string }> = [
    { name: "官方网站", icon: "Globe", status: "www.esaps.net/" },
    {
      name: "GitHub",
      icon: "Github",
      status: "github.com/The-ESAP-Project/",
    },
    { name: "Discord", icon: "Discord", status: "即将开放" },
    { name: "QQ 群", icon: "Users", status: "qm.qq.com/q/J9Js2rl7CG" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map((platform, index) => (
        <motion.div
          key={platform.name}
          className="bg-muted rounded-lg p-4 border border-border"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-center gap-3">
            <Icon name={platform.icon} size={28} className="text-foreground" />
            <div className="flex-1">
              <div className="font-semibold text-foreground">
                {platform.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {platform.status === "即将开放" ? (
                  <span className="text-esap-yellow">{platform.status}</span>
                ) : (
                  <a
                    href={`https://${platform.status}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-esap-blue hover:underline"
                  >
                    {platform.status}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
