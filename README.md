🌿 Welcome to Social Media Cirla

Link Demo: https://drive.google.com/drive/folders/1W_cWTHOzPq8do3xUG6FvlwbBxfKfdFby

A modern social networking experience that lets people share moments, connect with friends, and chat in real time — built with React Native CLI on the frontend and Next.js + MongoDB on the backend. From posting (photos/videos) and following to messaging and notifications, Cirla delivers a smooth mobile‑first social experience.

🚀 Get Started

1) Install dependencies
``` bash
yarn install
```

2) Run the mobile app (React Native CLI)
``` bash
npx react-native start
```

Optional (run on device):

iOS

``` bash
npx react-native run-ios
```

Android

``` bash
npx react-native run-android
```

✨ Key Features

👤 Accounts & Profiles

Sign up / Sign in (Email + Google OAuth), JWT authentication.

Update profile info, avatar/cover photo, bio, external links.

Privacy controls: public / friends / private.

🏠 Feed

See posts from people you follow and trending suggestions.

Quick search by user, hashtag, or keyword.

📸 Story

Post vertical photo/video stories that expire after 24 hours (optional private Archive).

Story ring on avatars in Home/Profile; gradient ring for new stories, dimmed when viewed.

Full‑screen player: tap to next/previous, progress bar for each segment.

Interactions: quick emoji reactions, reply opens the chat (DM), viewer list and view count.

Highlights: pin stories to profile, group into collections, custom cover art.

Limits & media: up to 15s per segment (auto-split if longer), file size limits, server‑side transcode/compression, prefetch next story; CDN + 24h TTL.

📝 Posts

Text + photos/videos, #hashtags, @mentions.

Filters/sorting by topic, location, or media type.

Post detail page: large media, full description, comments, likes.

💬 Interactions & Connections

Like, comment, share, save.

Follow / Unfollow, friend suggestions.

⚡ Realtime Chat

1‑1 and group messaging via Socket.IO.

Online/typing indicators, read receipts.

🔔 Notifications

In‑app + push (Expo Notifications), updates for likes/comments/follows/messages.

🛡️ Moderation & Safety

Report content, flag violations, suspend accounts.

Sensitive‑word filters, anti‑spam, API rate limiting.

🛠️ Tech Stack

🧩 Frameworks

React Native — Mobile app (Expo/CLI)

React — Web (dashboard/admin) with shadcn/ui

NestJS — Backend REST API & WebSocket Gateways

🗣️ Language

TypeScript (strict) across mobile, web, and server

🗄️ Database

MongoDB with Mongoose (schemas, indexes, TTL)

🔌 Realtime & Media

Socket.IO — Messaging, presence, realtime notifications

ZegoCloud — Voice/Video calls & livestreams (optional)

☁️ Infrastructure & Third‑party Services

Cloudflare — DNS/CDN/Proxy; optional Images/R2/Workers

Firebase — Cloud Messaging (push), optional Auth/Analytics

eSMS — OTP/SMS brandname (Vietnam)

openrouter — AI integration (content suggestions, assistive moderation)

🎨 UI

shadcn/ui for the React web admin

React Native primitives: Modal, SafeAreaView, Gesture Handler, FlashList

🧰 Dev & VCS

Git, GitHub

Package managers: yarn / pnpm
