export type Lang = 'hi' | 'en';

export const translations = {
  hi: {
    // Header
    storeName: 'श्री गणेश किराना',
    posOnline: 'पीओएस ऑनलाइन',
    dashboard: 'डैशबोर्ड',
    mobileView: 'मोबाइल',
    posView: 'काउंटर बिलिंग',
    account: 'खाता',
    
    // Voice Hero Banner
    instantVoicePos: 'AI वॉइस बिलिंग',
    languagesSupported: '8 भारतीय भाषाएँ',
    voiceBillTitle: 'बोलकर बिल बनाएं',
    voiceBillSub: '',
    voicePlaceholder: 'उदा: "रमेश कुमार 2 किलो चीनी और ₹150 उधार जोड़ो"',
    listening: 'सुन रहा हूं... बोलिए',
    promptAtta: '+ 5kg आशीर्वाद आटा',
    promptCash: '+ ₹500 नकद जमा (सुरेश)',
    promptSales: 'आज की कुल बिक्री?',

    // Quick Actions
    newBill: 'नया बिल बनाएं',
    newBillSub: 'तुरंत बिलिंग [F1]',
    scanBarcode: 'बारकोड स्कैन',
    scanBarcodeSub: 'स्कैन और जोड़ें [F2]',
    live: 'लाइव',
    showQr: 'दुकान QR',
    addProduct: 'नया सामान जोड़ें',
    dailyReport: 'दैनिक Z-रिपोर्ट',

    // Sales Summary
    totalCollection: 'आज की कुल बिक्री',
    bills: 'बिल',
    upiShare: 'UPI व QR (73%)',
    cashShare: 'नकद (27%)',
    transactions: 'लेन-देन',
    autoSettles: 'आज रात 11:59 बजे सेटलमेंट • SBI खाता ••4291',
    settlement: 'सेटलमेंट',

    // Khata
    pendingKhata: 'बकाया ग्राहक खाता',
    pendingKhataSub: 'उधार बहीखाता लेजर',
    totalDue: 'कुल बकाया: ₹18,650',
    due: 'बकाया',
    daysAgo: '2 दिन पहले',
    dueToday: 'आज देय',
    weekLate: '1 हफ्ता लेट',
    remindBtn: 'तकादा भेजें',
    reminded: 'भेज दिया',
    viewAllLedger: 'सभी 14 खाते देखें',

    // Low Stock
    lowStockTitle: 'कम स्टॉक अलर्ट',
    lowStockSub: 'इन्वेंटरी निगरानी',
    itemsLow: '3 सामान कम हैं',
    packetsLeft: 'पैकेट बचे',
    bottlesLeft: 'बोतल बची',
    bagsLeft: 'बैग बचे',
    minText: 'न्यूनतम',
    supplier: 'सप्लायर',
    orderBtn: 'ऑर्डर करें',
    orderedBtn: 'ऑर्डर भेजा गया',

    // Daily Insights
    soldCount: '34 बिके',
    topSellerLabel: 'सबसे ज्यादा बिका सामान',
    topSellerItem: 'अमूल बटर 500g',
    footfallLabel: 'दुकान पर कुल ग्राहक',
    footfallCount: '86 ग्राहक',

    // Floating Glass Bar
    glassPlaceholder: 'क्या बिलिंग या सर्च करना चाहते हैं? बोलें या टाइप करें...',
    instantAi: 'स्मार्ट AI',
    balanced: 'बैलेंस्ड',
    posMode: 'POS मोड',
    voiceInput: 'बोलकर कहें',
    submit: 'सर्च करें',

    // Bottom Nav
    navHome: 'होम',
    navKhata: 'खाता',
    navInventory: 'स्टॉक',
    navSettings: 'सेटिंग्स',

    // QR Modal
    shopQrTitle: 'दुकान UPI QR कोड',
    download: 'डाउनलोड',
    shareQr: 'WhatsApp शेयर',

    // Customer Portal
    merchantRole: 'दुकानदार',
    customerRole: 'ग्राहक',
    customerGreeting: 'नमस्ते',
    customerSubtitle: 'आपका व्यक्तिगत खाता और ऑनलाइन ऑर्डर',
    myKhataBalance: 'मेरा कुल बकाया खाता',
    khataDueNotice: 'कृपया दुकान पर आते समय या UPI QR से भुगतान करें',
    payNowViaUpi: 'दुकान UPI QR से तुरंत भुगतान करें',
    customerCatalogTitle: 'दुकान का सामान',
    customerCatalogSub: 'सामान चुनें और WhatsApp पर सीधा ऑर्डर भेजें',
    myBillsTitle: 'मेरे पुराने बिल और रसीदें',
    myBillsSub: 'पिछली खरीदारी का विवरण',
    itemsInCart: 'सामान कार्ट में',
    sendOrderWhatsApp: 'WhatsApp पर ऑर्डर भेजें',
    callShop: 'दुकानदार को कॉल करें',
    billReceipt: 'रसीद देखें',
    paidStatus: 'पूर्ण भुगतान',
    dueStatus: 'उधार (खाता)',
  },
  en: {
    // Header
    storeName: 'Shree Ganesh Kirana',
    posOnline: 'POS ONLINE',
    dashboard: 'Dashboard',
    mobileView: 'Mobile',
    posView: 'Counter POS',
    account: 'Account',
    merchantRole: 'Shopkeeper',
    customerRole: 'Customer',
    
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

    // Customer Portal
    customerGreeting: 'Hello',
    customerSubtitle: 'Your Personal Ledger & Order Portal',
    myKhataBalance: 'My Khata Balance (Due with Store)',
    khataDueNotice: 'Please clear during your next store visit or via UPI QR',
    payNowViaUpi: 'Pay Instantly via Store UPI QR',
    customerCatalogTitle: 'Store Catalog (Order Online)',
    customerCatalogSub: 'Pick items and send instant WhatsApp grocery order',
    myBillsTitle: 'My Bills & Digital Receipts',
    myBillsSub: 'Previous Purchase History',
    itemsInCart: 'items in cart',
    sendOrderWhatsApp: 'Send Order on WhatsApp',
    callShop: 'Call Shopkeeper',
    billReceipt: 'View Receipt',
    paidStatus: 'Paid in Full',
    dueStatus: 'Khata Credit',
  }
};
