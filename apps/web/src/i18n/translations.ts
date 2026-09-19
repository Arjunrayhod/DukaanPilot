export type Lang = 'hi' | 'en' | 'gu' | 'mr';

export const translations = {
  hi: {
    // Header
    storeName: 'श्री गणेश किराना',
    posOnline: 'पीओएस ऑनलाइन',
    dashboard: 'डैशबोर्ड',
    mobileView: 'मोबाइल',
    posView: 'काउंटर बिलिंग',
    account: 'खाता',
    merchantRole: 'दुकानदार',
    customerRole: 'ग्राहक',
    soundboxLabel: 'स्मार्ट साउंडबॉक्स',
    
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

    // Bottom & Desktop Nav
    navHome: 'डैशबोर्ड',
    navPos: 'बिलिंग',
    navKhata: 'खाता',
    navInventory: 'स्टॉक',
    navAnalytics: 'रिपोर्ट',
    navSettings: 'सेटिंग्स',

    // QR Modal
    shopQrTitle: 'दुकान UPI QR कोड',
    download: 'डाउनलोड',
    shareQr: 'WhatsApp शेयर',

    // Customer Portal
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
    soundboxLabel: 'Smart Soundbox',
    
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

    // Bottom & Desktop Nav
    navHome: 'Dashboard',
    navPos: 'Billing',
    navKhata: 'Khata',
    navInventory: 'Inventory',
    navAnalytics: 'Analytics',
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
  },
  gu: {
    // Header
    storeName: 'શ્રી ગણેશ કિરાણા',
    posOnline: 'પીઓએસ ઓનલાઇન',
    dashboard: 'ડેશબોર્ડ',
    mobileView: 'મોબાઇલ',
    posView: 'કાઉન્ટર બિલિંગ',
    account: 'ખાતાવહી',
    merchantRole: 'વેપારી',
    customerRole: 'ગ્રાહક',
    soundboxLabel: 'સ્માર્ટ સાઉન્ડબોક્સ',
    
    // Voice Hero Banner
    instantVoicePos: 'AI વોઇસ બિલિંગ',
    languagesSupported: '8 ભારતીય ભાષાઓ',
    voiceBillTitle: 'બોલીને બિલ બનાવો',
    voiceBillSub: '',
    voicePlaceholder: 'દા.ત.: "રમેશ કુમાર 2 કિલો ખાંડ અને ₹150 ઉધાર ઉમેરો"',
    listening: 'સાંભળી રહ્યો છું... બોલો',
    promptAtta: '+ 5kg આશીર્વાદ લોટ',
    promptCash: '+ ₹500 રોકડ જમા (સુરેશ)',
    promptSales: 'આજનું કુલ વેચાણ?',

    // Quick Actions
    newBill: 'નવું બિલ બનાવો',
    newBillSub: 'ઝડપી બિલિંગ [F1]',
    scanBarcode: 'બારકોડ સ્કેન',
    scanBarcodeSub: 'સ્કેન અને ઉમેરો [F2]',
    live: 'લાઇવ',
    showQr: 'દુકાન QR',
    addProduct: 'નવો સામાન ઉમેરો',
    dailyReport: 'દૈનિક Z-રિપોર્ટ',

    // Sales Summary
    totalCollection: 'આજનું કુલ વેચાણ',
    bills: 'બિલ',
    upiShare: 'UPI અને QR (73%)',
    cashShare: 'રોકડ (27%)',
    transactions: 'વ્યવહારો',
    autoSettles: 'આજે રાત્રે 11:59 વાગ્યે સેટલમેન્ટ • SBI ખાતું ••4291',
    settlement: 'સેટલમેન્ટ',

    // Khata
    pendingKhata: 'બાકી ગ્રાહક ખાતાવહી',
    pendingKhataSub: 'ઉધાર ચોપડો લેજર',
    totalDue: 'કુલ બાકી: ₹18,650',
    due: 'બાકી',
    daysAgo: '2 દિવસ પહેલા',
    dueToday: 'આજે જમા',
    weekLate: '1 અઠવાડિયું મોડું',
    remindBtn: 'તકાદો મોકલો',
    reminded: 'મોકલી દીધું',
    viewAllLedger: 'બધા 14 ખાતા જુઓ',

    // Low Stock
    lowStockTitle: 'ઓછો સ્ટોક એલર્ટ',
    lowStockSub: 'ઇન્વેન્ટરી વોચ',
    itemsLow: '3 સામાન ઓછા છે',
    packetsLeft: 'પેકેટ બાકી',
    bottlesLeft: 'બોટલ બાકી',
    bagsLeft: 'થેલી બાકી',
    minText: 'લઘુત્તમ',
    supplier: 'સપ્લાયર',
    orderBtn: 'ઓર્ડર કરો',
    orderedBtn: 'ઓર્ડર મોકલ્યો',

    // Daily Insights
    soldCount: '34 વેચાયા',
    topSellerLabel: 'સૌથી વધુ વેચાયેલો સામાન',
    topSellerItem: 'અમૂલ બટર 500g',
    footfallLabel: 'દુકાને કુલ ગ્રાહકો',
    footfallCount: '86 ગ્રાહકો',

    // Floating Glass Bar
    glassPlaceholder: 'શું બિલિંગ કે સર્ચ કરવું છે? બોલો અથવા ટાઈપ કરો...',
    instantAi: 'સ્માર્ટ AI',
    balanced: 'બેલેન્સ્ડ',
    posMode: 'POS મોડ',
    voiceInput: 'બોલીને કહો',
    submit: 'શોધો',

    // Bottom & Desktop Nav
    navHome: 'ડેશબોર્ડ',
    navPos: 'બિલિંગ',
    navKhata: 'ખાતાવહી',
    navInventory: 'સ્ટોક',
    navAnalytics: 'રિપોર્ટ',
    navSettings: 'સેટિંગ્સ',

    // QR Modal
    shopQrTitle: 'દુકાન UPI QR કોડ',
    download: 'ડાઉનલોડ',
    shareQr: 'WhatsApp શેર',

    // Customer Portal
    customerGreeting: 'નમસ્તે',
    customerSubtitle: 'તમારું વ્યક્તિગત ખાતું અને ઓનલાઇન ઓર્ડર',
    myKhataBalance: 'મારું કુલ બાકી ખાતું',
    khataDueNotice: 'કૃપા કરીને દુકાને આવતી વખતે અથવા UPI QR થી ચૂકવણી કરો',
    payNowViaUpi: 'દુકાન UPI QR થી તરત ચૂકવણી કરો',
    customerCatalogTitle: 'દુકાનનો સામાન',
    customerCatalogSub: 'સામાન પસંદ કરો અને WhatsApp પર સીધો ઓર્ડર મોકલો',
    myBillsTitle: 'મારા જૂના બિલ અને રસીદો',
    myBillsSub: 'પાછલી ખરીદીની વિગતો',
    itemsInCart: 'સામાન કાર્ટમાં',
    sendOrderWhatsApp: 'WhatsApp પર ઓર્ડર મોકલો',
    callShop: 'દુકાનદારને કૉલ કરો',
    billReceipt: 'રસીદ જુઓ',
    paidStatus: 'સંપૂર્ણ ચૂકવણી',
    dueStatus: 'ઉધાર (ખાતું)',
  },
  mr: {
    // Header
    storeName: 'श्री गणेश किराणा',
    posOnline: 'पीओएस ऑनलाइन',
    dashboard: 'डॅशबोर्ड',
    mobileView: 'मोबाइल',
    posView: 'काउंटर बिलिंग',
    account: 'खातेवही',
    merchantRole: 'दुकानदार',
    customerRole: 'ग्राहक',
    soundboxLabel: 'स्मार्ट साउंडबॉक्स',
    
    // Voice Hero Banner
    instantVoicePos: 'AI व्हॉइस बिलिंग',
    languagesSupported: '8 भारतीय भाषा',
    voiceBillTitle: 'बोलून बिल तयार करा',
    voiceBillSub: '',
    voicePlaceholder: 'उदा: "रमेश कुमार 2 किलो साखर आणि ₹150 उधार जोडा"',
    listening: 'ऐकत आहे... बोला',
    promptAtta: '+ 5kg आशीर्वाद आटा',
    promptCash: '+ ₹500 रोख जमा (सुरेश)',
    promptSales: 'आजची एकूण विक्री?',

    // Quick Actions
    newBill: 'नवीन बिल बनवा',
    newBillSub: 'झटपट बिलिंग [F1]',
    scanBarcode: 'बारकोड स्कॅन',
    scanBarcodeSub: 'स्कॅन आणि जोडा [F2]',
    live: 'लाइव्ह',
    showQr: 'दुकान QR',
    addProduct: 'नवीन माल जोडा',
    dailyReport: 'दैनिक Z-अहवाल',

    // Sales Summary
    totalCollection: 'आजची एकूण विक्री',
    bills: 'बिल',
    upiShare: 'UPI व QR (73%)',
    cashShare: 'रोख (27%)',
    transactions: 'व्यवहार',
    autoSettles: 'आज रात्री 11:59 वाजता सेटलमेंट • SBI खाते ••4291',
    settlement: 'सेटलमेंट',

    // Khata
    pendingKhata: 'थकबाकी ग्राहक खाते',
    pendingKhataSub: 'उधार वहीखाते लेजर',
    totalDue: 'एकूण बाकी: ₹18,650',
    due: 'बाकी',
    daysAgo: '2 दिवस आधी',
    dueToday: 'आज देय',
    weekLate: '1 आठवडा उशीर',
    remindBtn: 'तगादा पाठवा',
    reminded: 'पाठवले',
    viewAllLedger: 'सर्व 14 खाती पहा',

    // Low Stock
    lowStockTitle: 'कमी स्टॉक अलर्ट',
    lowStockSub: 'इन्व्हेंटरी वॉच',
    itemsLow: '3 वस्तू कमी आहेत',
    packetsLeft: 'पाकिटे शिल्लक',
    bottlesLeft: 'बाटल्या शिल्लक',
    bagsLeft: 'पिशव्या शिल्लक',
    minText: 'किमान',
    supplier: 'पुरवठादार',
    orderBtn: 'ऑर्डर करा',
    orderedBtn: 'ऑर्डर पाठवली',

    // Daily Insights
    soldCount: '34 विकले',
    topSellerLabel: 'सर्वाधिक विकलेली वस्तू',
    topSellerItem: 'अमुल बटर 500g',
    footfallLabel: 'दुकान भेट एकूण ग्राहक',
    footfallCount: '86 ग्राहक',

    // Floating Glass Bar
    glassPlaceholder: 'काय बिलिंग किंवा शोधायचे आहे? बोला किंवा टाईप करा...',
    instantAi: 'स्मार्ट AI',
    balanced: 'बॅलन्स्ड',
    posMode: 'POS मोड',
    voiceInput: 'बोलून सांगा',
    submit: 'शोधा',

    // Bottom & Desktop Nav
    navHome: 'डॅशबोर्ड',
    navPos: 'बिलिंग',
    navKhata: 'खातेवही',
    navInventory: 'स्टॉक',
    navAnalytics: 'अहवाल',
    navSettings: 'सेटिंग्ज',

    // QR Modal
    shopQrTitle: 'दुकान UPI QR कोड',
    download: 'डाउनलोड',
    shareQr: 'WhatsApp शेअर',

    // Customer Portal
    customerGreeting: 'नमस्कार',
    customerSubtitle: 'तुमचे वैयक्तिक खाते आणि ऑनलाइन ऑर्डर',
    myKhataBalance: 'माझी एकूण बाकी रक्कम',
    khataDueNotice: 'कृपया दुकानात येताना किंवा UPI QR द्वारे पेमेंट करा',
    payNowViaUpi: 'दुकान UPI QR द्वारे त्वरित भरा',
    customerCatalogTitle: 'दुकानातील सामान',
    customerCatalogSub: 'सामान निवडा आणि WhatsApp वर थेट ऑर्डर पाठवा',
    myBillsTitle: 'माझी जुनी बिले आणि पावत्या',
    myBillsSub: 'मागील खरेदी तपशील',
    itemsInCart: 'सामान कार्टमध्ये',
    sendOrderWhatsApp: 'WhatsApp वर ऑर्डर पाठवा',
    callShop: 'दुकानदाराला कॉल करा',
    billReceipt: 'पावती पहा',
    paidStatus: 'पूर्ण पेमेंट',
    dueStatus: 'उधार (खाते)',
  }
};
