// Copyright 2021-2026 The ESAP Project
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

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface RssCopyButtonProps {
  url: string;
  copyLabel: string;
  copiedLabel: string;
}

export function RssCopyButton({
  url,
  copyLabel,
  copiedLabel,
}: RssCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-background border border-border hover:bg-muted/50 transition-colors shrink-0"
    >
      <Icon name={copied ? "Check" : "Copy"} size={12} />
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
