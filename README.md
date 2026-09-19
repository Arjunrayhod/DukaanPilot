# 🏪 DukaanPilot (दुकानपायलट) - AI-Powered Autonomous Local Business Operating System

> **Tagline:** बोलकर बिल बनाओ, उधारी और स्टॉक चुटकियों में संभालो (Voice-first Kirana & Retail Business OS)  
> **Target Audience:** Small Indian retail merchants, Kirana stores, FMCG traders, general stores, and local supermarkets.  
> **Core Mission:** Empowering 10M+ local Indian shopkeepers with Zero-Friction Voice Billing, WhatsApp Khata Ledger, Smart Inventory, and Automated Cloud Sync.

---

## 🌟 Key Features & Delivered Modules

### 1. 🎙️ Vernacular Voice-First POS Billing ("बोलकर बिलिंग")
- **Conversational Hindi & Hinglish NLP Engine:** Speak naturally like *"2 किलो आशीर्वाद आटा, 1L तेल और ₹150 उधार जोड़ो"*.
- **Realtime Catalog Matching:** Automatically extracts items, quantities (kilo, aadha, dedh, packets, boxes), and prices.
- **Smart POS Hotkeys & Function Strip:** Desktop keyboard support (`F1` for New Bill, `F2` for Barcode, `F4` for Cash, `F8` for UPI QR, `F9` for Khata, `Esc` to close).
- **Dynamic Customer Selector Modal:** Choose between quick Walk-in customer, search existing Khata ledgers, or add brand-new customers with 1-click.

### 2. 📖 Digital Khata & 1-Click WhatsApp Reminders ("उधारी खाता व तगादा")
- **Customer Ledger with Auto Debit/Credit:** Automatic Khata sync during POS sales, split payments, and direct credit payments.
- **Polite Hindi WhatsApp Reminders:** Pre-formatted payment reminder messages with deep-linked merchant UPI QR paylinks.
- **Credit Limit & Overdue Aging:** Real-time credit limits, overdue badges, and customer purchase history.

### 3. 📦 Smart Inventory, Batch & Expiry Tracker ("स्मार्ट स्टॉक व एक्सपायरी")
- **Automatic Stock Decrement:** Stock decrements immediately upon checkout with real-time audit logs.
- **Expiry Classification:** 3-tier safety tracking (`SAFE`, `NEAR_EXPIRY`, `EXPIRED`) to avoid dead inventory.
- **Supplier Restock & WhatsApp PO:** Low stock alerts with automated 1-click purchase orders sent to FMCG distributors.
- **Supplier Inward & Accounts Payable:** Direct inward GRN entry that increments inventory and updates supplier credit ledgers.

### 4. 🖨️ A4 Sticky Barcode Generator & Batch Sticker Printing ("A4 बारकोड स्टिकर शीट")
- **Standard A4 Label Layouts:** Indian retail standard **24-Up (3×8)** and **30-Up (3×10)** sticky paper sheets.
- **Custom EAN-13 Generator:** Generates compliant 13-digit EAN barcodes with SVG rendering for loose/unbranded kirana items.
- **Hardware Barcode Gun Support:** USB/Bluetooth barcode scanner integration with instant audio beep feedback.

### 5. 💵 Cashier Shift & Cash Drawer Float Reconciliation ("गल्ला मिलान व शिफ्ट")
- **Opening Float & Mid-Day Cash Drops:** Track morning float and store expenses/locker drops.
- **Physical Denomination Counter:** Note-by-note counter (₹500, ₹200, ₹100, ₹50, ₹20, ₹10, coins).
- **Over/Short Variance:** Instant handover report with 1-click WhatsApp shift summary to store owner.

### 6. 🔊 Smart Soundbox Audio Payment Alerts ("स्मार्ट साउंडबॉक्स")
- **Multi-lingual Voice Alerts:** Instant chime & speech alerts in Hindi, English, Gujarati, and Marathi for Cash & UPI payments.

### 7. 🎁 Customer Loyalty Points & Festive Coupons ("लॉयल्टी व डिस्काउंट")
- **Points Accumulation:** 1 point per ₹100 spend.
- **Instant POS Redemption:** 1-click discount deduction at checkout.
- **Festive Promotions Broadcast:** Festive discounts and festival coupons shareable over WhatsApp.

### 8. 📱 Customer Online Storefront & Live Order Tracking ("ऑनलाइन दुकान")
- **Public Ordering Portal:** Customers can browse items, place delivery/pickup orders, and choose Cash, UPI, or Khata credit.
- **Live Status Progression:** 4-stage tracking (*Order Placed -> Accepted -> Packed -> Delivered*).

### 9. 📊 Daily Z-Report & Sales Analytics ("दैनिक बिक्री रिपोर्ट")
- **Realtime Metrics:** Gross sales, gross profit margin %, average bill value, hourly trends, and cash/UPI ratio.
- **Owner WhatsApp Z-Report:** 1-click end-of-day summary dispatch to shopkeeper's phone.

### 10. ⚡ 100% Offline-First Architecture & GST Export
- **IndexedDB / Local Storage Cache:** Keep billing even when internet is completely disconnected.
- **Background Sync Queue:** Auto-enqueues transactions and syncs with cloud upon reconnection.
- **GSTR-1 Ready Reports:** Download standard GST tax breakdown and HSN-wise sales sheets.

---

## 🏗️ Architecture & Technology Stack

```
DukaanPilot Monorepo (npm workspaces)
├── apps/
│   └── web/                 # React 18, Vite, Tailwind CSS, Lucide Icons, Web Speech API
├── services/
│   └── api/                 # Node.js, Express, TypeScript, REST API, JWT Auth, Winston Logger
├── packages/
│   ├── database/            # Drizzle ORM / PostgreSQL Schema & Migrations
│   └── shared/              # Shared Types, Validators, and DTOs
└── scripts/                 # Maintenance, project size & seed scripts
```

- **Frontend:** React 18, Vite, Tailwind CSS, Web Speech API, Canvas/SVG Barcode Engine.
- **Backend Services:** Node.js, Express, TypeScript, Modular Controller-Service-Repository architecture.
- **Database:** PostgreSQL (Neon Serverless compatible) + SQLite/Local Storage fallback.
- **Testing:** Node.js native test runner (`node:test`) with 100% passing suites (**92/92 Unit & Integration tests**).

---

## 🚀 Quick Start & Development Setup

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/Arjunrayhod/DukaanPilot.git
cd DukaanPilot

# Install all dependencies across workspaces
npm install
```

### 2. Run Automated Tests
```bash
# Run API and Web unit tests
npm test
```

### 3. Start Development Servers
```bash
# Start Backend API daemon (Port 5000)
npm run dev:api

# Start Web Application (Port 5173)
npm run dev:web
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Quality & Verification Status

| Module / Test Suite | Status | Tests |
|---------------------|--------|-------|
| 🛒 POS & Barcode Engine | ✅ Passing | 6/6 |
| 🏷️ A4 Sticker Sheet Generator | ✅ Passing | 3/3 |
| 💵 Cashier Shift & Drawer Float | ✅ Passing | 5/5 |
| 🎙️ Vernacular Voice NLP Parser | ✅ Passing | 5/5 |
| 📖 Khata Ledger & Reminders | ✅ Passing | 7/7 |
| 📦 Smart Inventory & Stock Decrement | ✅ Passing | 6/6 |
| 🚚 Supplier Purchase Inward & AP | ✅ Passing | 4/4 |
| 🚚 Supplier Restock & PO | ✅ Passing | 5/5 |
| 🎁 Loyalty Points & Offers | ✅ Passing | 5/5 |
| 📱 Online Customer Orders | ✅ Passing | 6/6 |
| 🧾 Thermal Receipt Generator | ✅ Passing | 3/3 |
| 🔊 Smart Soundbox Voice Alerts | ✅ Passing | 5/5 |
| 📊 Realtime Sales & Profit | ✅ Passing | 2/2 |
| 📈 Daily Analytics & Z-Report | ✅ Passing | 4/4 |
| 📡 Offline-First Sync Engine | ✅ Passing | 3/3 |
| 🤖 AI Kirana Copilot | ✅ Passing | 3/3 |
| 📋 GST & Tax Calculations | ✅ Passing | 5/5 |
| 🔐 Backend Auth & REST APIs | ✅ Passing | 15/15 |
| **Total Automated Tests** | **✅ 100% PASSING** | **92 / 92** |

---

## 📜 License
MIT License. Built with ❤️ for Indian Retail & Kirana Shopkeepers.
