export type Lang = 'hi' | 'en';

export const translations = {
  hi: {
    // Header
    storeName: 'श्री गणेश किराना',
    posOnline: 'पीओएस ऑनलाइन',
    dashboard: 'डैशबोर्ड',
    mobileView: 'मोबाइल',
    posView: 'काउंटर POS',
    account: 'खाता',
    
    // Voice Hero Banner
    instantVoicePos: 'Instant AI वॉइस POS',
    languagesSupported: '8 भाषाएँ समर्थित',
    voiceBillTitle: 'बोलकर बिल बनाएं',
    voiceBillSub: '/ Voice Bill',
    voicePlaceholder: 'उदा: "रमेश कुमार 2 किलो चीनी और ₹150 उधार जोड़ो"',
    listening: 'सुन रहा हूं... "रमेश कुमार 2 किलो चीनी और ₹150 उधार जोड़ो"',
    promptAtta: '+ 5kg आशीर्वाद आटा',
    promptCash: '+ ₹500 नकद जमा (सुरेश)',
    promptSales: 'आज की कुल बिक्री?',

    // Quick Actions
    newBill: 'नया बिल बनाएं',
    newBillSub: 'New Quick Bill',
    scanBarcode: 'बारकोड स्कैन',
    scanBarcodeSub: 'Instant Scan & Add',
    live: 'Live',
    showQr: 'दुकान QR दिखाएं',
    addProduct: 'नया सामान जोड़ें',
    dailyReport: 'डेली Z-रिपोर्ट',

    // Sales Summary
    totalCollection: 'आज की कुल बिक्री • TOTAL COLLECTION',
    bills: 'बिल',
    upiShare: 'UPI / QR (73%)',
    cashShare: 'नकद / Cash (27%)',
    transactions: 'ट्रांजैक्शन',
    autoSettles: 'Auto-settles tonight 11:59 PM • SBI A/c ••4291',
    settlement: 'सेटलमेंट',

    // Khata
    pendingKhata: 'बकाया ग्राहक खाता',
    pendingKhataSub: 'Pending Khata Ledger',
    totalDue: 'कुल: ₹18,650',
    due: 'बकाया',
    daysAgo: '2 दिन पहले लिया',
    dueToday: 'आज देय',
    weekLate: '1 हफ्ता लेट',
    remindBtn: 'तकादा',
    reminded: 'भेजा गया',
    viewAllLedger: 'सभी 14 खाते देखें (View All Ledger)',

    // Low Stock
    lowStockTitle: 'कम स्टॉक अलर्ट',
    lowStockSub: 'Smart Low Stock Watch',
    itemsLow: '3 आइटम्स कम',
    packetsLeft: 'पैकेट बचे',
    bottlesLeft: 'बोतल बची',
    bagsLeft: 'बैग बचे',
    minText: 'न्यूनतम',
    supplier: 'सप्लायर',
    orderBtn: 'ऑर्डर',
    orderedBtn: 'ऑर्डर भेजा',

    // Daily Insights
    soldCount: '34 बिके',
    topSellerLabel: 'सबसे ज्यादा बिका सामान',
    topSellerItem: 'अमूल बटर 500g',
    footfallLabel: 'दुकान पर कुल ग्राहक',
    footfallCount: '86 Footfall',

    // Floating Glass Bar
    glassPlaceholder: 'क्या बनाना या जोड़ना चाहते हैं? (बोलें या लिखें...)',
    instantAi: 'Instant AI',
    balanced: 'Balanced',
    posMode: 'POS Mode',
    voiceInput: 'बोलकर कहें',
    submit: 'भेजें',

    // Bottom Nav
    navHome: 'होम',
    navKhata: 'बहीखाता',
    navInventory: 'इन्वेंटरी',
    navSettings: 'सेटिंग्स',

    // QR Modal
    shopQrTitle: 'दुकान UPI QR कोड',
    download: 'डाउनलोड',
    shareQr: 'WhatsApp शेयर',
  },
  en: {
    // Header
    storeName: 'Shree Ganesh Kirana',
    posOnline: 'POS ONLINE',
    dashboard: 'Dashboard',
    mobileView: 'Mobile',
    posView: 'Counter POS',
    account: 'Account',
    
    // Voice Hero Banner
    instantVoicePos: 'Instant AI Voice POS',
    languagesSupported: '8 Languages Supported',
    voiceBillTitle: 'Create Voice Bill',
    voiceBillSub: '/ Voice Bill',
    voicePlaceholder: 'Ex: "Ramesh Kumar 2kg Sugar and add ₹150 Credit"',
    listening: 'Listening... "Ramesh Kumar 2kg Sugar and add ₹150 Credit"',
    promptAtta: '+ 5kg Aashirvaad Atta',
    promptCash: '+ ₹500 Cash Deposit (Suresh)',
    promptSales: "Today's Total Sales?",

    // Quick Actions
    newBill: 'New Quick Bill',
    newBillSub: 'Fast Checkout [F1]',
    scanBarcode: 'Barcode Scanner',
    scanBarcodeSub: 'Instant Scan & Add',
    live: 'Live',
    showQr: 'Show Store QR',
    addProduct: 'Add New Product',
    dailyReport: 'Daily Z-Report',

    // Sales Summary
    totalCollection: "TODAY'S TOTAL COLLECTION",
    bills: 'Bills',
    upiShare: 'UPI / QR (73%)',
    cashShare: 'Cash (27%)',
    transactions: 'Transactions',
    autoSettles: 'Auto-settles tonight 11:59 PM • SBI A/c ••4291',
    settlement: 'Settlement',

    // Khata
    pendingKhata: 'Pending Khata Ledger',
    pendingKhataSub: 'Customer Credit Book',
    totalDue: 'Total: ₹18,650',
    due: 'Due',
    daysAgo: '2 days ago',
    dueToday: 'Due Today',
    weekLate: '1 Week Overdue',
    remindBtn: 'Remind',
    reminded: 'Sent',
    viewAllLedger: 'View All 14 Accounts',

    // Low Stock
    lowStockTitle: 'Low Stock Alerts',
    lowStockSub: 'Smart Inventory Watch',
    itemsLow: '3 Items Low',
    packetsLeft: 'packets left',
    bottlesLeft: 'bottles left',
    bagsLeft: 'bags left',
    minText: 'Min',
    supplier: 'Supplier',
    orderBtn: 'Order',
    orderedBtn: 'Ordered',

    // Daily Insights
    soldCount: '34 Sold',
    topSellerLabel: 'Top Selling Item Today',
    topSellerItem: 'Amul Butter 500g',
    footfallLabel: 'Total Store Footfall',
    footfallCount: '86 Visitors',

    // Floating Glass Bar
    glassPlaceholder: 'What would you like to create or change? (Speak or type...)',
    instantAi: 'Instant AI',
    balanced: 'Balanced',
    posMode: 'POS Mode',
    voiceInput: 'Voice Input',
    submit: 'Submit',

    // Bottom Nav
    navHome: 'Home',
    navKhata: 'Khata',
    navInventory: 'Inventory',
    navSettings: 'Settings',

    // QR Modal
    shopQrTitle: 'Store UPI QR Code',
    download: 'Download',
    shareQr: 'Share WhatsApp',
  }
};
