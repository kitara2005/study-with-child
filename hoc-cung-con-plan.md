# 📚 HỌC CÙNG CON — Kế Hoạch Thiết Kế Web Học Tập

> **Phiên bản:** 1.0  
> **Ngày tạo:** 08/02/2026  
> **Đối tượng:** Học sinh Lớp 4 (9–10 tuổi)  
> **Bộ sách:** Chân Trời Sáng Tạo (NXB Giáo dục Việt Nam)  
> **Mục tiêu:** Xây dựng nền tảng web hỗ trợ bé học tập tại nhà, có hướng dẫn trực quan, AI giải thích bài, và bài tập tương tác.

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Tầm nhìn

"Học Cùng Con" là website học tập dành cho học sinh tiểu học, giúp phụ huynh đồng hành cùng con trong việc ôn tập và củng cố kiến thức theo chương trình chính khóa bộ sách Chân Trời Sáng Tạo. Website tập trung vào trải nghiệm trực quan, sinh động, phù hợp lứa tuổi, kết hợp AI để hỗ trợ giải thích bài học theo cách cá nhân hóa.

### 1.2 Mục tiêu cốt lõi

| # | Mục tiêu | Mô tả |
|---|----------|-------|
| 1 | **Bám sát chương trình** | Nội dung 100% theo sách Chân Trời Sáng Tạo lớp 4, đúng thứ tự bài học, đúng thuật ngữ |
| 2 | **Trực quan hóa** | Mỗi bài học có hình ảnh, sơ đồ, animation minh họa để bé dễ hiểu |
| 3 | **AI hỗ trợ cá nhân** | Bé có thể hỏi AI bất cứ thắc mắc nào về bài đang học, AI trả lời phù hợp lứa tuổi |
| 4 | **Luyện tập tương tác** | Bài tập trắc nghiệm + tự luận có chấm điểm tự động, giải thích đáp án chi tiết |
| 5 | **Theo dõi tiến độ** | Phụ huynh nắm được con đã học bài nào, điểm số, mức độ hoàn thành |
| 6 | **Truy cập dễ dàng** | Responsive trên mọi thiết bị: điện thoại, máy tính bảng, laptop |

### 1.3 Đối tượng người dùng

- **Người dùng chính:** Học sinh lớp 4 (9–10 tuổi)
- **Người dùng phụ:** Phụ huynh (theo dõi, hỗ trợ con học)
- **Quản trị:** Admin (quản lý nội dung, cập nhật bài học)

---

## 2. CÁC MÔN HỌC & CẤU TRÚC NỘI DUNG

### 2.1 Danh sách môn học

| Môn | Icon | Số chương (HK1+HK2) | Ước tính số bài |
|-----|------|----------------------|-----------------|
| Toán | 🔢 | 5 chương | ~70 bài |
| Tiếng Việt | 📖 | 8 chủ đề | ~64 bài |
| Khoa học | 🔬 | 6 chủ đề | ~35 bài |
| Lịch sử & Địa lý | 🌍 | 2 phần (LS + ĐL) | ~30 bài |
| Đạo đức | 💝 | 8 bài | ~16 bài (gồm thực hành) |
| Tiếng Anh | 🇬🇧 | 10 units | ~40 bài |
| Tin học | 💻 | 4 chủ đề | ~20 bài |
| Hoạt động trải nghiệm | 🎨 | 9 chủ đề | ~18 bài |
| **Tổng cộng** | | | **~293 bài** |

### 2.2 Cấu trúc mỗi bài học

Mỗi bài học bao gồm **4 phần chính:**

```
📘 Bài học
├── 📖 Lý thuyết
│   ├── Nội dung kiến thức (text + hình minh họa)
│   ├── Hình ảnh / Sơ đồ / Animation trực quan
│   ├── Ví dụ mẫu có giải thích từng bước
│   └── Mẹo ghi nhớ (nếu có)
│
├── ✏️ Bài tập
│   ├── Trắc nghiệm (3–4 đáp án, chấm tự động)
│   ├── Điền khuyết / Kéo thả
│   ├── Tự luận ngắn (AI chấm + nhận xét)
│   └── Giải thích đáp án chi tiết sau mỗi câu
│
├── 🤖 Hỏi AI
│   ├── Chat trực tiếp với AI về bài đang học
│   ├── AI biết đúng ngữ cảnh bài học
│   └── Trả lời bằng ngôn ngữ phù hợp trẻ 9–10 tuổi
│
└── 📊 Kết quả
    ├── Điểm số + số sao (1–3 sao)
    ├── Các câu sai + giải thích lại
    └── Đề xuất ôn tập
```

### 2.3 Chi tiết nội dung từng môn

#### 🔢 TOÁN

**Học kỳ 1:**
- Chương 1: Số tự nhiên — Ôn tập số đến 100 000, hàng và lớp, so sánh, làm tròn, triệu và tỉ
- Chương 2: Bốn phép tính — Cộng trừ, nhân chia, tính chất giao hoán & kết hợp
- Chương 3: Hình học — Góc nhọn/vuông/tù, hai đường thẳng vuông góc/song song, hình bình hành/hình thoi

**Học kỳ 2:**
- Chương 4: Phân số — Khái niệm, so sánh, cộng trừ phân số cùng mẫu
- Chương 5: Đo lường & Thống kê — Đơn vị đo, biểu đồ cột, giải toán có lời văn

**Dạng minh họa trực quan cần có:**
- Ô chữ số (hàng đơn vị, chục, trăm, nghìn...) → animation so sánh
- Hình học tương tác (vẽ/xoay góc, kéo đường thẳng)
- Thanh phân số (chia đều, tô màu)
- Biểu đồ cột tương tác

#### 📖 TIẾNG VIỆT

**Các mảng kiến thức:**
- Đọc hiểu: Bài đọc + câu hỏi đọc hiểu (trắc nghiệm + tự luận)
- Luyện từ & câu: Danh từ, động từ, tính từ, từ ghép, từ láy, câu kể, câu hỏi
- Chính tả: Phân biệt phụ âm, nguyên âm, dấu thanh
- Tập làm văn: Văn kể chuyện, miêu tả đồ vật, miêu tả cây cối, viết thư

**Dạng minh họa trực quan cần có:**
- Word cloud phân loại từ (danh từ / động từ / tính từ)
- Sơ đồ cấu tạo câu (chủ ngữ — vị ngữ)
- Bài đọc highlight từ khóa
- Dàn ý mẫu cho tập làm văn (sơ đồ tư duy)

#### 🔬 KHOA HỌC

**Chủ đề chính:**
- Chất: Nước và tính chất, ba thể của nước, vòng tuần hoàn, không khí
- Năng lượng: Ánh sáng, bóng tối, âm thanh, nhiệt
- Thực vật & Động vật: Chuỗi thức ăn, hệ sinh thái
- Con người: Dinh dưỡng, vệ sinh an toàn thực phẩm

**Dạng minh họa trực quan cần có:**
- Sơ đồ chuyển thể nước (animation)
- Thí nghiệm mô phỏng (ánh sáng qua lăng kính, trộn màu)
- Chuỗi thức ăn kéo-thả
- Tháp dinh dưỡng tương tác

#### 🌍 LỊCH SỬ & ĐỊA LÝ

**Lịch sử:** Buổi đầu dựng nước (Văn Lang–Âu Lạc), khởi nghĩa Hai Bà Trưng, chiến thắng Bạch Đằng, nhà Lý, nhà Trần

**Địa lý:** Dãy Hoàng Liên Sơn, Trung du Bắc Bộ, Tây Nguyên, đồng bằng Bắc/Nam Bộ

**Dạng minh họa trực quan cần có:**
- Timeline lịch sử tương tác
- Bản đồ Việt Nam có thể nhấn vào từng vùng miền
- Hình ảnh di tích, danh lam
- Infographic so sánh vùng miền

#### 🇬🇧 TIẾNG ANH

**Chủ đề:** Greetings, School, Family, Daily routines, Animals, Food, Hobbies, Weather, Festivals

**Kỹ năng:** Nghe (audio), Nói (ghi âm so sánh), Đọc (đọc hiểu đoạn ngắn), Viết (điền từ, sắp xếp câu)

**Dạng minh họa trực quan cần có:**
- Flashcard từ vựng có hình + phát âm
- Hội thoại mẫu (dạng chat bubble)
- Bài nghe audio + câu hỏi
- Trò chơi ghép từ, nối cặp

#### 💻 TIN HỌC

**Nội dung:** Sử dụng máy tính, soạn thảo văn bản, tìm kiếm thông tin, lập trình Scratch cơ bản

#### 💝 ĐẠO ĐỨC

**Nội dung:** Trung thực, tự tin, yêu lao động, kính trọng thầy cô, đoàn kết, bảo vệ môi trường

**Hình thức:** Câu chuyện tình huống + bé chọn cách xử lý → AI nhận xét

---

## 3. TÍNH NĂNG CHÍNH

### 3.1 Bản đồ tính năng

```
🏠 Học Cùng Con
│
├── 👶 Tài khoản học sinh
│   ├── Đăng ký / Đăng nhập
│   ├── Hồ sơ cá nhân (avatar, tên, lớp)
│   └── Bảng thành tích & huy hiệu
│
├── 📚 Học bài
│   ├── Chọn môn → Chọn chương → Chọn bài
│   ├── Xem lý thuyết (text + hình + animation)
│   ├── Làm bài tập (trắc nghiệm, điền từ, kéo thả)
│   ├── Hỏi AI (chat trong ngữ cảnh bài học)
│   └── Xem kết quả + giải thích đáp án
│
├── 🎮 Luyện tập vui
│   ├── Trò chơi ôn tập (quiz nhanh, ghép cặp, đúng/sai)
│   ├── Thử thách hàng ngày (3 câu/ngày)
│   └── Bảng xếp hạng (tùy chọn)
│
├── 📊 Theo dõi tiến độ (Phụ huynh)
│   ├── Dashboard tổng quan
│   ├── Điểm số từng môn, từng bài
│   ├── Thời gian học
│   ├── Điểm yếu cần ôn tập
│   └── Báo cáo tuần/tháng
│
├── 🤖 AI Gia sư
│   ├── Hỏi bài theo ngữ cảnh
│   ├── Giải thích lại bài tập sai
│   ├── Gợi ý ôn tập cá nhân
│   └── Đọc bài cho bé nghe (Text-to-Speech)
│
├── 🔔 Thông báo
│   ├── Nhắc học hàng ngày
│   ├── Thông báo bài mới
│   └── Khen thưởng khi đạt mốc
│
└── ⚙️ Cài đặt
    ├── Chọn học kỳ (HK1 / HK2)
    ├── Chế độ tối (Dark mode)
    ├── Cỡ chữ
    └── Quản lý tài khoản
```

### 3.2 Hệ thống khuyến khích học tập (Gamification)

| Cơ chế | Mô tả |
|--------|-------|
| **Sao ⭐** | Mỗi bài tập đạt ≥80% → 3 sao, ≥50% → 2 sao, <50% → 1 sao |
| **Huy hiệu 🏅** | Hoàn thành 1 chương, học 7 ngày liên tục, đạt điểm tuyệt đối... |
| **Streak 🔥** | Đếm số ngày học liên tục, khuyến khích duy trì |
| **Cấp độ 🎖️** | Lên cấp khi tích đủ sao (Học sinh mới → Ngôi sao → Nhà thông thái...) |
| **Thử thách 🎯** | Thử thách hàng ngày 3 câu, thưởng xu/huy hiệu |

### 3.3 Tính năng AI chi tiết

**Mô hình sử dụng:** Claude API (claude-sonnet-4-20250514)

**Các tình huống AI hỗ trợ:**

1. **Hỏi bài trong bài học:** Bé đọc lý thuyết, chưa hiểu → nhấn tab "Hỏi AI" → gõ câu hỏi → AI giải thích dùng ví dụ đời thường, ngôn ngữ đơn giản
2. **Giải thích bài tập sai:** Bé làm sai → AI phân tích tại sao sai, gợi ý cách nghĩ đúng
3. **Ôn tập thông minh:** AI ghi nhận các bài bé hay sai → đề xuất ôn tập trọng điểm
4. **Chấm bài tự luận:** Bé viết đoạn văn → AI nhận xét về nội dung, chính tả, ngữ pháp (nhẹ nhàng, khuyến khích)

**System prompt mẫu cho AI:**

```
Bạn là giáo viên tiểu học dịu dàng, kiên nhẫn, đang dạy học sinh lớp 4
(9-10 tuổi) ở Việt Nam. Bé đang học bài [TÊN BÀI] thuộc [TÊN CHƯƠNG],
môn [TÊN MÔN].

Quy tắc:
- Giải thích NGẮN GỌN (≤150 từ), dùng từ ngữ đơn giản
- Dùng ví dụ thực tế gần gũi đời sống
- Có thể dùng emoji vừa phải
- Luôn khen ngợi và động viên khi bé hỏi
- Nếu bé hỏi ngoài bài, nhẹ nhàng hướng lại
- Trả lời bằng tiếng Việt
```

---

## 4. THIẾT KẾ GIAO DIỆN (UI/UX)

### 4.1 Nguyên tắc thiết kế

- **Thân thiện trẻ em:** Góc bo tròn, màu sắc tươi sáng, icon dễ thương
- **Chữ to rõ ràng:** Font size tối thiểu 14px cho nội dung, 16–18px cho tiêu đề
- **Ít text, nhiều hình:** Ưu tiên minh họa trực quan, giảm thiểu văn bản dài
- **Tương tác rõ ràng:** Nút bấm lớn, feedback rõ (animation khi đúng/sai)
- **Responsive:** Tối ưu cho iPad/tablet (thiết bị phổ biến nhất với trẻ em)

### 4.2 Bảng màu

| Vai trò | Màu | Hex Code |
|---------|-----|----------|
| Primary (header, nút chính) | Tím gradient | `#667eea → #764ba2` |
| Toán | Đỏ san hô | `#FF6B6B` |
| Tiếng Việt | Xanh ngọc | `#4ECDC4` |
| Khoa học | Xanh dương | `#45B7D1` |
| Lịch sử & Địa lý | Xanh lá nhạt | `#96CEB4` |
| Tiếng Anh | Vàng | `#F7DC6F` |
| Đạo đức | Tím nhạt | `#DDA0DD` |
| Tin học | Xanh lá | `#82E0AA` |
| Đúng / Thành công | Xanh lá | `#4CAF50` |
| Sai / Cảnh báo | Đỏ | `#FF5252` |
| Nền chính | Trắng xanh nhạt | `#FAFBFF` |

### 4.3 Typography

- **Font chính:** "Segoe UI", "Roboto", system-ui, sans-serif
- **Tiêu đề lớn:** 20–24px, font-weight 800
- **Tiêu đề bài:** 16–18px, font-weight 700
- **Nội dung:** 14–16px, font-weight 400, line-height 1.7
- **Chú thích:** 12–13px, color #888

### 4.4 Wireframe các trang chính

#### Trang chủ

```
┌──────────────────────────────────┐
│  📚 Học Cùng Con    [👤 Avatar]  │  ← Header cố định
├──────────────────────────────────┤
│                                  │
│      🎒 Chào [Tên bé]!          │
│    Hôm nay mình học gì nhỉ?     │
│                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ 🔢  │ │ 📖  │ │ 🔬  │       │  ← Grid môn học
│  │Toán │ │T.Việt│ │K.Học│       │
│  └─────┘ └─────┘ └─────┘       │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ 🌍  │ │ 🇬🇧  │ │ 💻  │       │
│  │LS-ĐL│ │T.Anh│ │T.Học│       │
│  └─────┘ └─────┘ └─────┘       │
│                                  │
│  📊 Tiến độ học tập              │
│  ┌──────┬──────┬──────┐         │
│  │✅ 12 │📝 28 │⭐ 8.5│         │  ← Thống kê nhanh
│  │Đã học│Bài tập│Điểm TB│        │
│  └──────┴──────┴──────┘         │
│                                  │
│  🔥 Streak: 5 ngày liên tục!    │
│  🎯 Thử thách hôm nay: 0/3     │
│                                  │
└──────────────────────────────────┘
```

#### Trang danh sách bài học (trong 1 môn)

```
┌──────────────────────────────────┐
│  ← Quay lại   📚 Học Cùng Con   │
├──────────────────────────────────┤
│  ┌──────────────────────────┐   │
│  │ 🔢  Toán Lớp 4           │   │  ← Banner môn học
│  │ Chân Trời Sáng Tạo       │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Chương 1: Số tự nhiên ──    │
│                                  │
│  ✅ Bài 1: Ôn tập số đến 100k  │
│  ✅ Bài 2: Hàng và lớp          │
│  ▶  Bài 3: So sánh số tự nhiên │  ← Bài đang học
│  🔒 Bài 4: Làm tròn số         │
│                                  │
│  ── Chương 2: Bốn phép tính ── │
│                                  │
│  🔒 Bài 5: Phép cộng, trừ      │
│  🔒 Bài 6: Phép nhân           │
│                                  │
└──────────────────────────────────┘
```

#### Trang bài học

```
┌──────────────────────────────────┐
│  ← Quay lại   📚 Học Cùng Con   │
├──────────────────────────────────┤
│  Chương 1 > Bài 3               │
│  So sánh các số tự nhiên        │
│                                  │
│  [📖 Lý thuyết] [✏️ Bài tập] [🤖 AI] │ ← Tabs
│                                  │
│  ┌──────────────────────────┐   │
│  │ 📌 Quy tắc 1:            │   │
│  │ Số nào nhiều chữ số hơn  │   │
│  │ thì lớn hơn.             │   │
│  │                           │   │
│  │  [999] < [1000]          │   │  ← Hình minh họa
│  │   3cs     4cs             │   │
│  │                           │   │
│  │ 💡 Ví dụ: 999 < 1000     │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ 📌 Quy tắc 2: ...        │   │
│  └──────────────────────────┘   │
│                                  │
│  [  ✏️ Làm bài tập ngay!    ]   │  ← CTA button
│                                  │
└──────────────────────────────────┘
```

---

## 5. KIẾN TRÚC KỸ THUẬT

### 5.1 Tổng quan kiến trúc

```
┌─────────────────────────────────────────────┐
│                 FRONTEND                     │
│          Next.js 14 (App Router)             │
│     React + Tailwind CSS + Framer Motion     │
│              PWA (offline-ready)             │
├─────────────────────────────────────────────┤
│                   API Layer                  │
│            Next.js API Routes                │
├──────────┬──────────┬───────────────────────┤
│ Supabase │ Claude   │  Cloudinary / S3      │
│ Database │ API      │  (Hình ảnh, Audio)    │
│ + Auth   │ (AI)     │                       │
└──────────┴──────────┴───────────────────────┘
```

### 5.2 Công nghệ sử dụng

| Thành phần | Công nghệ | Lý do chọn |
|------------|-----------|-------------|
| **Frontend** | Next.js 14 (React) | SSR/SSG tốt cho SEO, App Router hiện đại, DX tốt |
| **Styling** | Tailwind CSS | Responsive nhanh, nhất quán, dễ maintain |
| **Animation** | Framer Motion | Animation mượt mà, API đơn giản |
| **Database** | Supabase (PostgreSQL) | Free tier rộng rãi, realtime, auth tích hợp |
| **Authentication** | Supabase Auth | Email/password + Google login, đơn giản |
| **AI Engine** | Claude API (Sonnet) | Giải thích bài phù hợp trẻ em, tiếng Việt tốt |
| **File Storage** | Supabase Storage / Cloudinary | Lưu hình ảnh, audio bài học |
| **Hosting** | Vercel | Deploy tự động, CDN toàn cầu, free tier đủ dùng |
| **Analytics** | PostHog (self-host) hoặc Plausible | Theo dõi hành vi học tập, privacy-friendly |
| **CMS nội dung** | Notion API hoặc Sanity.io | Cho team content nhập/sửa bài học dễ dàng |

### 5.3 Cấu trúc Database

```sql
-- Bảng người dùng
users
├── id (UUID, PK)
├── email
├── full_name
├── avatar_url
├── role (student / parent)
├── parent_id (FK → users, nullable)
├── grade (default: 4)
├── streak_count
├── total_stars
├── level
└── created_at

-- Bảng môn học
subjects
├── id (PK)
├── name (Toán, Tiếng Việt...)
├── icon
├── color
└── order_index

-- Bảng chương / chủ đề
units
├── id (PK)
├── subject_id (FK)
├── name
├── semester (1 / 2)
└── order_index

-- Bảng bài học
lessons
├── id (PK)
├── unit_id (FK)
├── title
├── theory_content (JSON — sections, visuals, examples)
├── order_index
└── created_at

-- Bảng bài tập
exercises
├── id (PK)
├── lesson_id (FK)
├── type (multiple_choice / fill_blank / drag_drop / essay)
├── question
├── options (JSON)
├── correct_answer
├── explanation
└── order_index

-- Bảng kết quả học tập
results
├── id (PK)
├── user_id (FK)
├── lesson_id (FK)
├── score
├── stars (1–3)
├── answers (JSON — chi tiết từng câu)
├── time_spent (seconds)
└── completed_at

-- Bảng huy hiệu
badges
├── id (PK)
├── name
├── description
├── icon
└── condition (JSON — điều kiện đạt được)

-- Bảng huy hiệu người dùng
user_badges
├── user_id (FK)
├── badge_id (FK)
└── earned_at

-- Bảng lịch sử chat AI
ai_conversations
├── id (PK)
├── user_id (FK)
├── lesson_id (FK)
├── messages (JSON array)
└── created_at
```

### 5.4 Cấu trúc thư mục dự án

```
hoc-cung-con/
├── app/
│   ├── layout.tsx              # Layout chính
│   ├── page.tsx                # Trang chủ
│   ├── login/page.tsx          # Đăng nhập
│   ├── subjects/
│   │   └── [subjectId]/
│   │       ├── page.tsx        # Danh sách bài
│   │       └── [lessonId]/
│   │           └── page.tsx    # Bài học
│   ├── progress/page.tsx       # Tiến độ
│   ├── challenges/page.tsx     # Thử thách
│   └── api/
│       ├── ai/chat/route.ts    # API chat AI
│       ├── ai/grade/route.ts   # API chấm bài tự luận
│       └── progress/route.ts   # API lưu kết quả
│
├── components/
│   ├── ui/                     # Button, Card, Modal...
│   ├── lesson/
│   │   ├── TheorySection.tsx
│   │   ├── ExerciseSection.tsx
│   │   ├── AIChatPanel.tsx
│   │   └── ResultScreen.tsx
│   ├── visuals/                # Hình minh họa tương tác
│   │   ├── DigitBoxes.tsx
│   │   ├── CompareColumns.tsx
│   │   ├── WaterCycle.tsx
│   │   ├── HistoryTimeline.tsx
│   │   └── ...
│   └── layout/
│       ├── Header.tsx
│       ├── SubjectGrid.tsx
│       └── ProgressBar.tsx
│
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── claude.ts               # Claude API wrapper
│   └── utils.ts                # Helpers
│
├── content/                    # Dữ liệu bài học (JSON/MDX)
│   ├── toan/
│   ├── tieng-viet/
│   ├── khoa-hoc/
│   └── ...
│
├── public/
│   ├── images/                 # Hình minh họa
│   ├── audio/                  # Audio tiếng Anh
│   └── icons/
│
└── styles/
    └── globals.css
```

---

## 6. KẾ HOẠCH TRIỂN KHAI

### 6.1 Phân pha phát triển

#### 🏁 Phase 1: MVP (4–6 tuần)

**Mục tiêu:** Ra mắt bản dùng được với 2 môn chính

| Tuần | Công việc | Output |
|------|-----------|--------|
| 1 | Setup dự án, database, auth, layout | Khung web chạy được, đăng nhập |
| 2 | Trang chủ, danh sách môn, danh sách bài | Luồng điều hướng hoàn chỉnh |
| 3 | Component lý thuyết + hình minh họa | 10 bài Toán HK1 có hình |
| 4 | Component bài tập + chấm điểm | Bài tập trắc nghiệm hoạt động |
| 5 | Tích hợp AI chat + 10 bài Tiếng Việt | AI hỏi bài + thêm 1 môn |
| 6 | Trang tiến độ, sửa bug, test | MVP hoàn chỉnh 2 môn |

**Kết quả Phase 1:** 20 bài học (Toán + Tiếng Việt), bài tập trắc nghiệm, AI hỏi bài, theo dõi tiến độ cơ bản.

#### 🚀 Phase 2: Mở rộng nội dung (4–6 tuần)

| Công việc | Chi tiết |
|-----------|----------|
| Thêm 3 môn | Khoa học, Lịch sử & Địa lý, Tiếng Anh |
| Nội dung HK1 đầy đủ | ~120 bài học cho 5 môn |
| Bài tập đa dạng | Thêm dạng điền từ, kéo thả, sắp xếp |
| Audio Tiếng Anh | Phát âm từ vựng, bài nghe |
| Gamification | Huy hiệu, streak, cấp độ |
| Dashboard phụ huynh | Xem tiến độ con, báo cáo tuần |

#### 🎯 Phase 3: Hoàn thiện (4 tuần)

| Công việc | Chi tiết |
|-----------|----------|
| Thêm môn còn lại | Đạo đức, Tin học, Hoạt động trải nghiệm |
| Nội dung HK2 | Hoàn thiện cả năm học |
| PWA | Cài đặt như app, hoạt động offline |
| AI chấm tự luận | Bé viết văn → AI nhận xét |
| Thử thách & xếp hạng | Thử thách hàng ngày, bảng xếp hạng |
| Tối ưu hiệu suất | Lazy loading, image optimization, caching |

#### 🌟 Phase 4: Nâng cao (liên tục)

- Mở rộng lớp 3, lớp 5
- Text-to-Speech (đọc bài cho bé)
- Chế độ thi thử (đề kiểm tra giữa kỳ, cuối kỳ)
- Cộng đồng phụ huynh (chia sẻ kinh nghiệm)
- Mobile app (React Native)

### 6.2 Timeline tổng quan

```
Tháng 1–2:  ████████░░░░░░░░  Phase 1 (MVP)
Tháng 2–3:  ░░░░░░░░████████  Phase 2 (Mở rộng)
Tháng 4:    ░░░░░░░░░░░░████  Phase 3 (Hoàn thiện)
Tháng 5+:   ░░░░░░░░░░░░░░██  Phase 4 (Nâng cao, liên tục)
```

---

## 7. CHI PHÍ ƯỚC TÍNH

### 7.1 Chi phí hạ tầng (hàng tháng)

| Hạng mục | Free Tier | Khi mở rộng |
|----------|-----------|-------------|
| **Hosting (Vercel)** | $0 (hobby) | $20/tháng (pro) |
| **Database (Supabase)** | $0 (500MB, 50k rows) | $25/tháng (8GB) |
| **Claude API** | — | $10–50/tháng (tùy lượng chat) |
| **Storage (hình/audio)** | $0 (1GB Supabase) | $5–10/tháng |
| **Domain** | — | ~$10/năm (.vn) hoặc $15/năm (.com) |
| **Tổng ban đầu** | **~$0–10/tháng** | **~$60–100/tháng** |

### 7.2 Chi phí nhân sự (nếu thuê)

| Vai trò | Thời gian | Chi phí ước tính |
|---------|-----------|-----------------|
| Frontend Developer | 3–4 tháng | 30–60 triệu VNĐ |
| Content Creator (soạn bài) | 2–3 tháng | 15–25 triệu VNĐ |
| UI/UX Designer | 1 tháng | 10–15 triệu VNĐ |
| **Tổng (nếu thuê full)** | | **55–100 triệu VNĐ** |

> 💡 **Tiết kiệm:** Nếu tự code (với sự hỗ trợ của AI) + tự soạn nội dung, chi phí chỉ còn tiền hosting + API ≈ **dưới 1 triệu/tháng**.

---

## 8. CHIẾN LƯỢC NỘI DUNG

### 8.1 Quy trình soạn 1 bài học

```
1. Đọc sách giáo khoa    → Xác định kiến thức trọng tâm
2. Viết lý thuyết         → Ngắn gọn, dễ hiểu, chia thành 2–4 phần
3. Thiết kế hình minh họa → SVG / Animation / Hình tương tác
4. Soạn ví dụ mẫu        → Có giải thích từng bước
5. Soạn bài tập           → 4–6 câu, đa dạng dạng, có explain
6. Viết AI prompt         → System prompt riêng cho ngữ cảnh bài
7. Review & test          → Kiểm tra chính xác, chạy thử
```

### 8.2 Tiêu chuẩn nội dung

- Đúng 100% theo sách Chân Trời Sáng Tạo (đối chiếu từng trang)
- Ngôn ngữ phù hợp trẻ 9–10 tuổi (câu ngắn, từ đơn giản)
- Mỗi phần lý thuyết không quá 3–4 câu
- Mỗi bài tập có giải thích đáp án chi tiết
- Hình minh họa phải hỗ trợ hiểu bài, không chỉ trang trí

### 8.3 Nguồn tham khảo nội dung

- Sách giáo khoa Chân Trời Sáng Tạo lớp 4 (NXB Giáo dục)
- Sách bài tập Chân Trời Sáng Tạo lớp 4
- Vở thực hành các môn
- Tài liệu hướng dẫn giáo viên (để hiểu mục tiêu bài học)

---

## 9. BẢO MẬT & QUYỀN RIÊNG TƯ

### 9.1 Nguyên tắc bảo vệ trẻ em (COPPA-aligned)

- Không thu thập thông tin cá nhân không cần thiết
- Tài khoản bé được tạo và quản lý bởi phụ huynh
- Không có tính năng chat giữa các học sinh
- AI chỉ trả lời trong phạm vi học tập, từ chối nội dung không phù hợp
- Không quảng cáo bên thứ ba
- Dữ liệu lưu trên Supabase (tuân thủ GDPR)

### 9.2 AI Safety

- System prompt nghiêm ngặt: chỉ trả lời về bài học
- Từ chối nhẹ nhàng nếu bé hỏi ngoài phạm vi
- Rate limit: tối đa 50 lượt chat AI / ngày / tài khoản
- Log và giám sát nội dung AI phản hồi

---

## 10. CHỈ SỐ ĐO LƯỜNG THÀNH CÔNG (KPIs)

| Chỉ số | Mục tiêu Phase 1 | Mục tiêu 6 tháng |
|--------|-------------------|-------------------|
| Số bài học hoàn chỉnh | 20 bài | 200+ bài |
| Thời gian học trung bình / phiên | ≥ 10 phút | ≥ 15 phút |
| Tỉ lệ hoàn thành bài tập | ≥ 60% | ≥ 75% |
| Điểm trung bình bài tập | ≥ 6/10 | ≥ 7/10 |
| Streak trung bình | ≥ 3 ngày | ≥ 5 ngày |
| Tỉ lệ quay lại (retention) | ≥ 40% tuần | ≥ 50% tuần |

---

## 11. TÓM TẮT & BƯỚC TIẾP THEO

### Ưu tiên hành động ngay

1. ✅ Xác nhận thiết kế tổng quan (tài liệu này)
2. 🔲 Setup dự án Next.js + Supabase + Vercel
3. 🔲 Soạn nội dung 10 bài Toán đầu tiên (theo SGK)
4. 🔲 Xây component lý thuyết + bài tập + AI chat
5. 🔲 Test với bé, thu thập feedback
6. 🔲 Lặp lại: sửa → thêm nội dung → test

### Liên hệ & Ghi chú

- Dự án có thể bắt đầu ngay với chi phí gần như $0
- Claude AI có thể hỗ trợ soạn nội dung bài học nhanh chóng
- Ưu tiên chất lượng nội dung hơn số lượng tính năng
- Luôn test với bé thật để đảm bảo phù hợp lứa tuổi

---

> 📝 **Ghi chú:** Tài liệu này là bản kế hoạch tổng quan. Mỗi phase sẽ có tài liệu chi tiết riêng khi triển khai. Nội dung bài học cần được đối chiếu kỹ với sách giáo khoa Chân Trời Sáng Tạo phiên bản mới nhất.
