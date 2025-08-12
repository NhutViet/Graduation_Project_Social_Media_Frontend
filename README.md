🌿 Welcome to Socail Meida Cirla 

Một trải nghiệm mạng xã hội hiện đại cho phép người dùng chia sẻ khoảnh khắc, kết nối bạn bè và trò chuyện thời gian thực — xây dựng bằng React Native CLI ở frontend và NextJS + MongoDB ở backend. Từ đăng bài (ảnh/video), theo dõi, đến nhắn tin và nhận thông báo, Cirla mang lại trải nghiệm mạng xã hội mượt mà trên di động.

🚀 Get Started

1) Cài đặt phụ thuộc
```bash
   yarn install
```
2) Chạy ứng dụng mobile (React Native CLI
```bash
npx react-native run-start
```
Tùy chọn (build chạy thiết bị thật):
iOS
```bash
npx react-native run-ios
```
Android
```bash
npx react-native run-android
```

✨ Key Features

👤 Tài khoản & Hồ sơ

Đăng ký/Đăng nhập (Email + Google OAuth), xác thực JWT.

Cập nhật thông tin cá nhân, ảnh đại diện/ảnh bìa, bio, liên kết.

Quản lý quyền riêng tư: công khai/bạn bè/riêng tư.

🏠 Bảng Tin (Feed)

Hiển thị bài viết của người theo dõi và gợi ý xu hướng.

Tìm kiếm nhanh theo người dùng, hashtag, từ khoá.

📸 Story

Đăng story ảnh/video dọc, tự động hết hạn sau 24 giờ (lưu vào Archive riêng tư nếu bật).

Vòng tròn story trên avatar ở Home/Profile; hiển thị gradient ring khi có story mới, đổi màu khi đã xem.

Trình phát toàn màn hình: tap để chuyển tiếp/quay lại, thanh tiến độ cho từng đoạn.

Tương tác: reaction nhanh bằng emoji, reply mở thẳng cuộc trò chuyện (DM), danh sách người xem, đếm lượt xem.

Highlights: ghim story lên profile, nhóm thành bộ sưu tập, ảnh bìa tuỳ chỉnh.

Giới hạn & media: tối đa 15 giây/đoạn (tự chia nếu dài), giới hạn kích thước tệp, nén/transcode phía server, tải trước (prefetch) story tiếp theo; dùng CDN và TTL 24h.

📝 Bài viết

Văn bản + ảnh/video, hashtag #tag, nhắc tên @user.

Bộ lọc/hiển thị theo chủ đề, vị trí, hoặc phương tiện.

Trang chi tiết bài viết: ảnh lớn, mô tả đầy đủ, bình luận, lượt thích.

💬 Tương tác & Kết nối

Thích (like), bình luận, chia sẻ, lưu bài.

Theo dõi/Huỷ theo dõi, gợi ý bạn bè.

⚡ Chat Realtime

Nhắn tin 1‑1/nhóm bằng Socket.IO.

Trạng thái online/đang gõ, xem đã đọc.

🔔 Thông báo

In‑app + push (Expo Notifications), cập nhật like/bình luận/theo dõi/tin nhắn.

🛡️ Quản trị & An toàn

Báo cáo nội dung, gắn cờ vi phạm, khoá tài khoản.

Bộ lọc từ nhạy cảm, chống spam, rate‑limit API.

🛠️ Tech Stack

🧩 Frameworks

React Native — Ứng dụng di động (Expo/CLI)

React — Web (dashboard/admin), kết hợp shadcn/ui

NestJS — Backend REST API & WebSocket Gateways

🗣️ Ngôn ngữ

TypeScript (strict) trên cả mobile, web và server

🗄️ Cơ sở dữ liệu

MongoDB với Mongoose (schema, index, TTL)

🔌 Realtime & Media

Socket.IO ("Socket") — Nhắn tin, presence, thông báo realtime

ZegoCloud — Thoại/Video call & livestream (nếu bật)

☁️ Hạ tầng & Dịch vụ bên thứ ba

Cloudflare — DNS/CDN/Proxy; tuỳ chọn Images/R2/Workers

Firebase — Cloud Messaging (push), tuỳ chọn Auth/Analytics

eSMS — OTP/SMS brandname (VN)

openrouter — Tích hợp AI (gợi ý nội dung, kiểm duyệt hỗ trợ)

🎨 UI

shadcn/ui cho phần React web (admin)

Thành phần React Native: Modal, SafeAreaView, Gesture Handler, FlashList

🧰 Dev & VCS

Git, GitHub 

Trình quản lý gói: yarn / pnpm


