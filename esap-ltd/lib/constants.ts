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

export const ESAP_COLORS = {
  yellow: { primary: "#ffd93d", dark: "#ffc107" },
  pink: { primary: "#ff69b4", dark: "#ff1493" },
  blue: { primary: "#4da6ff", dark: "#2e8fff" },
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  products: "/products",
  contact: "/contact",
} as const;

export const SITE_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://esap.ltd",
  siteName: "ESAP",
  tagline: "Creative Technology Studio",
  authors: ["AptS:1547", "AptS:1548"],
  startYear: 2021,
} as const;

export const EXTERNAL_LINKS = {
  weareWebsite: "https://weare.esaps.net",
  storyWebsite: "https://story.esaps.net",
  github: "https://github.com/The-ESAP-Project/WeAreESAP",
} as const;
