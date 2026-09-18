/**
 * DukaanPilot - Synthetic Demo Dataset Seed (DemoMart - 100+ Kirana Products)
 */

const { memoryStore } = require('./index');

const sampleSuppliers = [
  { id: 'sup_1', name: 'Bansal Wholesale Mart', contactPerson: 'Sunil Bansal', phone: '+91 98110 12345', paymentTerms: 'Net 15' },
  { id: 'sup_2', name: 'Jindal Agro & Oil Distributors', contactPerson: 'Vikas Jindal', phone: '+91 98220 23456', paymentTerms: 'Net 7' },
  { id: 'sup_3', name: 'Amul City Milk Agency', contactPerson: 'Rakesh Patel', phone: '+91 98330 34567', paymentTerms: 'Daily Cash' },
  { id: 'sup_4', name: 'ITC & Britannia Direct Depot', contactPerson: 'Anand Sharma', phone: '+91 98440 45678', paymentTerms: 'Net 15' },
  { id: 'sup_5', name: 'Hindustan Consumer Supplies', contactPerson: 'Deepak Gupta', phone: '+91 98550 56789', paymentTerms: 'Net 30' },
];

const sampleCategories = [
  { id: 'cat_atta', name: 'Atta, Flour & Grains', nameHindi: '???, ???? ?? ????', icon: 'wheat', displayOrder: 1 },
  { id: 'cat_oils', name: 'Edible Oils & Ghee', nameHindi: '????? ??? ?? ??', icon: 'droplet', displayOrder: 2 },
  { id: 'cat_spices', name: 'Spices & Masalas', nameHindi: '????? ?? ???', icon: 'flame', displayOrder: 3 },
  { id: 'cat_dals', name: 'Pulses & Dals', nameHindi: '????? ?? ????', icon: 'box', displayOrder: 4 },
  { id: 'cat_dairy', name: 'Dairy & Bakery', nameHindi: '???, ??? ?? ?????', icon: 'milk', displayOrder: 5 },
  { id: 'cat_snacks', name: 'Snacks & Biscuits', nameHindi: '?????, ??????? ?? ??????', icon: 'cookie', displayOrder: 6 },
  { id: 'cat_beverages', name: 'Tea, Coffee & Drinks', nameHindi: '???, ???? ?? ???', icon: 'coffee', displayOrder: 7 },
  { id: 'cat_sugar', name: 'Sugar & Sweeteners', nameHindi: '????, ??? ?? ???', icon: 'archive', displayOrder: 8 },
  { id: 'cat_personal', name: 'Personal & Oral Care', nameHindi: '?????, ???????? ?? ??????', icon: 'heart', displayOrder: 9 },
  { id: 'cat_cleaning', name: 'Cleaning & Household', nameHindi: '????????? ?? ????', icon: 'sparkles', displayOrder: 10 },
];

const standardProducts = [
  // Atta, Flour & Grains (12 items)
  { name: 'Aashirvaad Shudh Chakki Atta 10kg', nameHindi: '???????? ????? ??? 10 ????', categoryId: 'cat_atta', unit: 'bag', costPrice: 380, sellingPrice: 420, mrp: 440, currentStock: 2, minThreshold: 5, barcode: '8901030381011', supplierId: 'sup_1' },
  { name: 'Aashirvaad Shudh Chakki Atta 5kg', nameHindi: '???????? ????? ??? 5 ????', categoryId: 'cat_atta', unit: 'bag', costPrice: 195, sellingPrice: 220, mrp: 235, currentStock: 8, minThreshold: 4, barcode: '8901030381028', supplierId: 'sup_1' },
  { name: 'Fortune Chakki Fresh Atta 10kg', nameHindi: '????????? ????? ??? 10 ????', categoryId: 'cat_atta', unit: 'bag', costPrice: 360, sellingPrice: 395, mrp: 415, currentStock: 6, minThreshold: 4, barcode: '8906007281015', supplierId: 'sup_2' },
  { name: 'India Gate Basmati Rice Classic 5kg', nameHindi: '?????? ??? ?????? ???? 5 ????', categoryId: 'cat_atta', unit: 'bag', costPrice: 480, sellingPrice: 550, mrp: 600, currentStock: 5, minThreshold: 3, barcode: '8901725181012', supplierId: 'sup_1' },
  { name: 'Daawat Rozana Super Basmati Rice 5kg', nameHindi: '???? ?????? ???? 5 ????', categoryId: 'cat_atta', unit: 'bag', costPrice: 320, sellingPrice: 375, mrp: 410, currentStock: 10, minThreshold: 4, barcode: '8901537001019', supplierId: 'sup_1' },
  { name: 'Kolam Daily Steam Rice 10kg', nameHindi: '???? ???? 10 ????', categoryId: 'cat_atta', unit: 'bag', costPrice: 520, sellingPrice: 590, mrp: 650, currentStock: 12, minThreshold: 5, barcode: '8909988110011', supplierId: 'sup_1' },
  { name: 'Rajdhani Sooji / Rawa 500g', nameHindi: '??????? ???? 500 ?????', categoryId: 'cat_atta', unit: 'packet', costPrice: 28, sellingPrice: 35, mrp: 38, currentStock: 15, minThreshold: 6, barcode: '8906014410118', supplierId: 'sup_1' },
  { name: 'Rajdhani Besan 500g', nameHindi: '??????? ???? 500 ?????', categoryId: 'cat_atta', unit: 'packet', costPrice: 45, sellingPrice: 55, mrp: 62, currentStock: 14, minThreshold: 5, barcode: '8906014410217', supplierId: 'sup_1' },
  { name: 'Rajdhani Maida 500g', nameHindi: '??????? ???? 500 ?????', categoryId: 'cat_atta', unit: 'packet', costPrice: 26, sellingPrice: 32, mrp: 36, currentStock: 18, minThreshold: 5, barcode: '8906014410316', supplierId: 'sup_1' },
  { name: 'Loose Wheat / Sabut Gehun 1kg', nameHindi: '????? ????? 1 ????', categoryId: 'cat_atta', unit: 'kg', costPrice: 28, sellingPrice: 34, mrp: 35, currentStock: 120, minThreshold: 30, barcode: 'LOC-WHEAT-01', supplierId: 'sup_1' },
  { name: 'Loose Poha / Flattened Rice 1kg', nameHindi: '???? 1 ????', categoryId: 'cat_atta', unit: 'kg', costPrice: 42, sellingPrice: 52, mrp: 55, currentStock: 25, minThreshold: 8, barcode: 'LOC-POHA-01', supplierId: 'sup_1' },
  { name: 'Quaker Rolled Oats 1kg', nameHindi: '?????? ???? 1 ????', categoryId: 'cat_atta', unit: 'packet', costPrice: 160, sellingPrice: 190, mrp: 210, currentStock: 7, minThreshold: 3, barcode: '8901491101018', supplierId: 'sup_4' },

  // Edible Oils & Ghee (10 items)
  { name: 'Fortune Kachi Ghani Mustard Oil 1L', nameHindi: '????????? ????? ??? 1 ????', categoryId: 'cat_oils', unit: 'bottle', costPrice: 125, sellingPrice: 145, mrp: 160, currentStock: 1, minThreshold: 6, barcode: '8906007282012', supplierId: 'sup_2' },
  { name: 'Fortune Sunlite Refined Sunflower Oil 1L', nameHindi: '????????? ??????? ??? 1 ????', categoryId: 'cat_oils', unit: 'pouch', costPrice: 118, sellingPrice: 135, mrp: 150, currentStock: 14, minThreshold: 6, barcode: '8906007282029', supplierId: 'sup_2' },
  { name: 'Engine Brand Pure Mustard Oil 1L', nameHindi: '???? ????? ??? 1 ????', categoryId: 'cat_oils', unit: 'bottle', costPrice: 135, sellingPrice: 155, mrp: 175, currentStock: 8, minThreshold: 4, barcode: '8901234002011', supplierId: 'sup_2' },
  { name: 'Saffola Gold Pro Healthy Oil 1L', nameHindi: '????? ????? ??? 1 ????', categoryId: 'cat_oils', unit: 'pouch', costPrice: 145, sellingPrice: 170, mrp: 195, currentStock: 9, minThreshold: 4, barcode: '8901088012015', supplierId: 'sup_5' },
  { name: 'Amul Pure Ghee 1L Tin', nameHindi: '???? ????? ?? 1 ????', categoryId: 'cat_oils', unit: 'tin', costPrice: 560, sellingPrice: 620, mrp: 650, currentStock: 4, minThreshold: 3, barcode: '8901262010014', supplierId: 'sup_3' },
  { name: 'Amul Pure Ghee 500ml Pouch', nameHindi: '???? ????? ?? 500 ????', categoryId: 'cat_oils', unit: 'pouch', costPrice: 285, sellingPrice: 315, mrp: 330, currentStock: 10, minThreshold: 4, barcode: '8901262010021', supplierId: 'sup_3' },
  { name: 'Patanjali Cow Ghee 1L', nameHindi: '?????? ??? ?? ???? ?? 1 ????', categoryId: 'cat_oils', unit: 'carton', costPrice: 570, sellingPrice: 630, mrp: 660, currentStock: 6, minThreshold: 3, barcode: '8904109450011', supplierId: 'sup_2' },
  { name: 'Dalda Vanaspati Ghee 1L Pouch', nameHindi: '????? ??????? ?? 1 ????', categoryId: 'cat_oils', unit: 'pouch', costPrice: 95, sellingPrice: 115, mrp: 130, currentStock: 8, minThreshold: 4, barcode: '8901537110018', supplierId: 'sup_2' },
  { name: 'Fortune Soya Health Refined Oil 1L', nameHindi: '????????? ???? ??? 1 ????', categoryId: 'cat_oils', unit: 'pouch', costPrice: 108, sellingPrice: 125, mrp: 140, currentStock: 16, minThreshold: 6, barcode: '8906007282036', supplierId: 'sup_2' },
  { name: 'Dhara Kachi Ghani Mustard Oil 1L', nameHindi: '???? ????? ??? 1 ????', categoryId: 'cat_oils', unit: 'bottle', costPrice: 128, sellingPrice: 148, mrp: 165, currentStock: 7, minThreshold: 4, barcode: '8901648002013', supplierId: 'sup_2' },

  // Spices & Masalas (14 items)
  { name: 'Tata Salt Vacuum Evaporated 1kg', nameHindi: '???? ??? 1 ????', categoryId: 'cat_spices', unit: 'packet', costPrice: 22, sellingPrice: 28, mrp: 30, currentStock: 45, minThreshold: 15, barcode: '8901030010010', supplierId: 'sup_1' },
  { name: 'Tata Salt Lite Low Sodium 1kg', nameHindi: '???? ????? ???? 1 ????', categoryId: 'cat_spices', unit: 'packet', costPrice: 38, sellingPrice: 48, mrp: 52, currentStock: 12, minThreshold: 5, barcode: '8901030010027', supplierId: 'sup_1' },
  { name: 'MDH Deggi Mirch Powder 100g', nameHindi: '?????? ???? ????? 100 ?????', categoryId: 'cat_spices', unit: 'box', costPrice: 78, sellingPrice: 95, mrp: 105, currentStock: 16, minThreshold: 6, barcode: '8902506001014', supplierId: 'sup_1' },
  { name: 'MDH Haldi / Turmeric Powder 100g', nameHindi: '?????? ????? ????? 100 ?????', categoryId: 'cat_spices', unit: 'box', costPrice: 34, sellingPrice: 44, mrp: 50, currentStock: 20, minThreshold: 6, barcode: '8902506001021', supplierId: 'sup_1' },
  { name: 'MDH Dhania / Coriander Powder 100g', nameHindi: '?????? ????? ????? 100 ?????', categoryId: 'cat_spices', unit: 'box', costPrice: 36, sellingPrice: 46, mrp: 52, currentStock: 18, minThreshold: 6, barcode: '8902506001038', supplierId: 'sup_1' },
  { name: 'Everest Garam Masala 100g', nameHindi: '??????? ??? ????? 100 ?????', categoryId: 'cat_spices', unit: 'box', costPrice: 68, sellingPrice: 82, mrp: 92, currentStock: 14, minThreshold: 5, barcode: '8901786101011', supplierId: 'sup_1' },
  { name: 'Everest Chaat Masala 100g', nameHindi: '??????? ??? ????? 100 ?????', categoryId: 'cat_spices', unit: 'box', costPrice: 58, sellingPrice: 72, mrp: 80, currentStock: 11, minThreshold: 4, barcode: '8901786101028', supplierId: 'sup_1' },
  { name: 'Everest Kasuri Methi 50g', nameHindi: '??????? ????? ???? 50 ?????', categoryId: 'cat_spices', unit: 'box', costPrice: 35, sellingPrice: 45, mrp: 50, currentStock: 15, minThreshold: 4, barcode: '8901786101035', supplierId: 'sup_1' },
  { name: 'Catch Black Pepper / Kali Mirch 100g', nameHindi: '??? ???? ????? ????? 100 ?????', categoryId: 'cat_spices', unit: 'sprinkler', costPrice: 85, sellingPrice: 110, mrp: 125, currentStock: 8, minThreshold: 3, barcode: '8901192101016', supplierId: 'sup_1' },
  { name: 'LG Hing / Compounded Asafoetida 50g', nameHindi: '???? ???? 50 ?????', categoryId: 'cat_spices', unit: 'bottle', costPrice: 55, sellingPrice: 68, mrp: 75, currentStock: 12, minThreshold: 4, barcode: '8906002100014', supplierId: 'sup_1' },
  { name: 'Loose Cumin / Jeera Sabut 100g', nameHindi: '????? ???? 100 ?????', categoryId: 'cat_spices', unit: 'packet', costPrice: 32, sellingPrice: 42, mrp: 45, currentStock: 30, minThreshold: 10, barcode: 'LOC-JEERA-100', supplierId: 'sup_1' },
  { name: 'Loose Mustard Seeds / Rai 100g', nameHindi: '??? / ????? ???? 100 ?????', categoryId: 'cat_spices', unit: 'packet', costPrice: 14, sellingPrice: 20, mrp: 22, currentStock: 25, minThreshold: 8, barcode: 'LOC-RAI-100', supplierId: 'sup_1' },
  { name: 'Loose Cloves / Laung 50g', nameHindi: '???? 50 ?????', categoryId: 'cat_spices', unit: 'packet', costPrice: 48, sellingPrice: 65, mrp: 70, currentStock: 16, minThreshold: 5, barcode: 'LOC-LAUNG-50', supplierId: 'sup_1' },
  { name: 'Loose Green Cardamom / Elaichi 50g', nameHindi: '??? ?????? 50 ?????', categoryId: 'cat_spices', unit: 'packet', costPrice: 140, sellingPrice: 180, mrp: 200, currentStock: 9, minThreshold: 3, barcode: 'LOC-ELAICHI-50', supplierId: 'sup_1' },

  // Pulses & Dals (10 items)
  { name: 'Tata Sampann Unpolished Toor Dal 1kg', nameHindi: '???? ??????? ???? ??? 1 ????', categoryId: 'cat_dals', unit: 'packet', costPrice: 148, sellingPrice: 175, mrp: 195, currentStock: 15, minThreshold: 5, barcode: '8901030401016', supplierId: 'sup_1' },
  { name: 'Tata Sampann Moong Dal Dhuli 1kg', nameHindi: '???? ??????? ???? ??? 1 ????', categoryId: 'cat_dals', unit: 'packet', costPrice: 120, sellingPrice: 145, mrp: 160, currentStock: 12, minThreshold: 4, barcode: '8901030401023', supplierId: 'sup_1' },
  { name: 'Tata Sampann Chana Dal 1kg', nameHindi: '???? ??????? ??? ??? 1 ????', categoryId: 'cat_dals', unit: 'packet', costPrice: 88, sellingPrice: 105, mrp: 118, currentStock: 18, minThreshold: 5, barcode: '8901030401030', supplierId: 'sup_1' },
  { name: 'Tata Sampann Urad Dal Split 1kg', nameHindi: '???? ??????? ???? ??? 1 ????', categoryId: 'cat_dals', unit: 'packet', costPrice: 130, sellingPrice: 155, mrp: 170, currentStock: 10, minThreshold: 4, barcode: '8901030401047', supplierId: 'sup_1' },
  { name: 'Tata Sampann Kabuli Chana 1kg', nameHindi: '???? ??????? ?????? ??? / ???? 1 ????', categoryId: 'cat_dals', unit: 'packet', costPrice: 135, sellingPrice: 160, mrp: 180, currentStock: 14, minThreshold: 4, barcode: '8901030401054', supplierId: 'sup_1' },
  { name: 'Tata Sampann Rajma Red 1kg', nameHindi: '???? ??????? ??????? ????? 1 ????', categoryId: 'cat_dals', unit: 'packet', costPrice: 145, sellingPrice: 170, mrp: 190, currentStock: 11, minThreshold: 4, barcode: '8901030401061', supplierId: 'sup_1' },
  { name: 'Loose Kala Chana Desi 1kg', nameHindi: '???? ???? ??? 1 ????', categoryId: 'cat_dals', unit: 'kg', costPrice: 68, sellingPrice: 82, mrp: 88, currentStock: 35, minThreshold: 10, barcode: 'LOC-CHANA-01', supplierId: 'sup_1' },
  { name: 'Loose Masoor Dal Malki 1kg', nameHindi: '???? ??? 1 ????', categoryId: 'cat_dals', unit: 'kg', costPrice: 82, sellingPrice: 98, mrp: 105, currentStock: 22, minThreshold: 6, barcode: 'LOC-MASOOR-01', supplierId: 'sup_1' },
  { name: 'Loose White Soya Chunks 1kg', nameHindi: '???? ???? / ???? ????? 1 ????', categoryId: 'cat_dals', unit: 'kg', costPrice: 90, sellingPrice: 115, mrp: 125, currentStock: 15, minThreshold: 5, barcode: 'LOC-SOYA-01', supplierId: 'sup_1' },
  { name: 'Nutrela Soya Chunks 200g Box', nameHindi: '?????????? ???? ???? 200 ?????', categoryId: 'cat_dals', unit: 'box', costPrice: 42, sellingPrice: 52, mrp: 60, currentStock: 20, minThreshold: 6, barcode: '8906007284016', supplierId: 'sup_2' },

  // Dairy & Bakery (10 items)
  { name: 'Amul Taaza Fresh Toned Milk 500ml', nameHindi: '???? ???? ??? 500 ????', categoryId: 'cat_dairy', unit: 'packet', costPrice: 25, sellingPrice: 27, mrp: 27, currentStock: 35, minThreshold: 10, barcode: '8901262020013', supplierId: 'sup_3' },
  { name: 'Amul Gold Full Cream Milk 500ml', nameHindi: '???? ????? ??? 500 ????', categoryId: 'cat_dairy', unit: 'packet', costPrice: 31, sellingPrice: 33, mrp: 33, currentStock: 28, minThreshold: 10, barcode: '8901262020020', supplierId: 'sup_3' },
  { name: 'Amul Salted Butter 100g', nameHindi: '???? ??? ????? 100 ?????', categoryId: 'cat_dairy', unit: 'box', costPrice: 52, sellingPrice: 58, mrp: 60, currentStock: 22, minThreshold: 8, barcode: '8901262030012', supplierId: 'sup_3' },
  { name: 'Amul Masti Dahi Pouch 400g', nameHindi: '???? ????? ??? 400 ?????', categoryId: 'cat_dairy', unit: 'pouch', costPrice: 30, sellingPrice: 35, mrp: 35, currentStock: 18, minThreshold: 6, barcode: '8901262040011', supplierId: 'sup_3' },
  { name: 'Amul Malai Paneer 200g Fresh', nameHindi: '???? ???? ???? 200 ?????', categoryId: 'cat_dairy', unit: 'packet', costPrice: 82, sellingPrice: 95, mrp: 100, currentStock: 14, minThreshold: 5, barcode: '8901262050010', supplierId: 'sup_3' },
  { name: 'Amul Cheese Slices 200g (10 Slices)', nameHindi: '???? ??? ?????? 200 ?????', categoryId: 'cat_dairy', unit: 'pack', costPrice: 125, sellingPrice: 145, mrp: 155, currentStock: 12, minThreshold: 4, barcode: '8901262060019', supplierId: 'sup_3' },
  { name: 'Britannia Daily Fresh White Bread 400g', nameHindi: '?????????? ????? ????? 400 ?????', categoryId: 'cat_dairy', unit: 'packet', costPrice: 38, sellingPrice: 45, mrp: 45, currentStock: 16, minThreshold: 5, barcode: '8901063010018', supplierId: 'sup_4' },
  { name: 'Britannia 100% Whole Wheat Bread 400g', nameHindi: '?????????? ?????? ????? 400 ?????', categoryId: 'cat_dairy', unit: 'packet', costPrice: 45, sellingPrice: 55, mrp: 55, currentStock: 10, minThreshold: 4, barcode: '8901063010025', supplierId: 'sup_4' },
  { name: 'Mother Dairy Classic Curd 400g Cup', nameHindi: '??? ????? ??? 400 ????? ??', categoryId: 'cat_dairy', unit: 'cup', costPrice: 36, sellingPrice: 42, mrp: 45, currentStock: 15, minThreshold: 5, barcode: '8901648030016', supplierId: 'sup_3' },
  { name: 'Amul Kool Elaichi Milk 180ml Can', nameHindi: '???? ??? ?????? 180 ????', categoryId: 'cat_dairy', unit: 'can', costPrice: 22, sellingPrice: 25, mrp: 25, currentStock: 24, minThreshold: 8, barcode: '8901262070018', supplierId: 'sup_3' },

  // Snacks & Biscuits (12 items)
  { name: 'Parle-G Gold Biscuits 1kg Family Pack', nameHindi: '?????-?? ??????? 1 ???? ???', categoryId: 'cat_snacks', unit: 'pack', costPrice: 92, sellingPrice: 110, mrp: 120, currentStock: 24, minThreshold: 8, barcode: '8901719101019', supplierId: 'sup_4' },
  { name: 'Britannia Marie Gold 300g Super Saver', nameHindi: '?????????? ???? ????? 300 ?????', categoryId: 'cat_snacks', unit: 'pack', costPrice: 35, sellingPrice: 42, mrp: 45, currentStock: 30, minThreshold: 10, barcode: '8901063020017', supplierId: 'sup_4' },
  { name: 'Britannia Good Day Butter Cookies 200g', nameHindi: '??? ?? ??? ??????? 200 ?????', categoryId: 'cat_snacks', unit: 'pack', costPrice: 38, sellingPrice: 48, mrp: 50, currentStock: 28, minThreshold: 8, barcode: '8901063020024', supplierId: 'sup_4' },
  { name: 'Haldirams Nagpur Bhujia Sev 400g', nameHindi: '???????? ?????? ??? 400 ?????', categoryId: 'cat_snacks', unit: 'pouch', costPrice: 95, sellingPrice: 115, mrp: 130, currentStock: 20, minThreshold: 6, barcode: '8904004401019', supplierId: 'sup_4' },
  { name: 'Haldirams All in One Mixture 400g', nameHindi: '???????? ?? ?? ?? ?????? 400 ?????', categoryId: 'cat_snacks', unit: 'pouch', costPrice: 95, sellingPrice: 115, mrp: 130, currentStock: 18, minThreshold: 6, barcode: '8904004401026', supplierId: 'sup_4' },
  { name: 'Maggi 2-Minute Masala Noodles 4-Pack (280g)', nameHindi: '???? 2-???? ?????? 4 ???', categoryId: 'cat_snacks', unit: 'pack', costPrice: 50, sellingPrice: 58, mrp: 60, currentStock: 36, minThreshold: 12, barcode: '8901058851015', supplierId: 'sup_4' },
  { name: 'Yippee Magic Masala Noodles 240g', nameHindi: '?????? ????? ????? ?????? 240 ?????', categoryId: 'cat_snacks', unit: 'pack', costPrice: 42, sellingPrice: 50, mrp: 52, currentStock: 22, minThreshold: 8, barcode: '8901030501013', supplierId: 'sup_1' },
  { name: 'Lays India Magic Masala Chips 50g', nameHindi: '??? ????? ????? ????? 50 ?????', categoryId: 'cat_snacks', unit: 'packet', costPrice: 16, sellingPrice: 20, mrp: 20, currentStock: 40, minThreshold: 15, barcode: '8901491102015', supplierId: 'sup_4' },
  { name: 'Kurkure Masala Munch 85g', nameHindi: '??????? ????? ??? 85 ?????', categoryId: 'cat_snacks', unit: 'packet', costPrice: 16, sellingPrice: 20, mrp: 20, currentStock: 45, minThreshold: 15, barcode: '8901491102022', supplierId: 'sup_4' },
  { name: 'Cadbury Dairy Milk Chocolate 50g', nameHindi: '?????? ????? ????? ?????? 50 ?????', categoryId: 'cat_snacks', unit: 'piece', costPrice: 38, sellingPrice: 45, mrp: 45, currentStock: 30, minThreshold: 10, barcode: '8901233010017', supplierId: 'sup_4' },
  { name: 'Cadbury 5 Star Chocolate 40g', nameHindi: '?????? 5 ????? ?????? 40 ?????', categoryId: 'cat_snacks', unit: 'piece', costPrice: 16, sellingPrice: 20, mrp: 20, currentStock: 35, minThreshold: 10, barcode: '8901233010024', supplierId: 'sup_4' },
  { name: 'Sunfeast Dark Fantasy Choco Fills 300g', nameHindi: '????? ??????? ????? 300 ?????', categoryId: 'cat_snacks', unit: 'box', costPrice: 110, sellingPrice: 135, mrp: 150, currentStock: 14, minThreshold: 5, barcode: '8901030502010', supplierId: 'sup_1' },

  // Tea, Coffee & Drinks (10 items)
  { name: 'Brooke Bond Red Label Tea 500g', nameHindi: '??? ???? ??? ????? 500 ?????', categoryId: 'cat_beverages', unit: 'packet', costPrice: 220, sellingPrice: 260, mrp: 280, currentStock: 25, minThreshold: 8, barcode: '8901030020019', supplierId: 'sup_5' },
  { name: 'Tata Tea Gold Leaf Tea 500g', nameHindi: '???? ?? ????? ??? 500 ?????', categoryId: 'cat_beverages', unit: 'pouch', costPrice: 245, sellingPrice: 290, mrp: 310, currentStock: 20, minThreshold: 6, barcode: '8901030020026', supplierId: 'sup_1' },
  { name: 'Wagh Bakri Strong CTC Tea 500g', nameHindi: '??? ???? ??? 500 ?????', categoryId: 'cat_beverages', unit: 'packet', costPrice: 210, sellingPrice: 250, mrp: 270, currentStock: 18, minThreshold: 6, barcode: '8901512001010', supplierId: 'sup_1' },
  { name: 'Nescafe Classic Instant Coffee 50g Jar', nameHindi: '???????? ??????? ???? 50 ????? ???', categoryId: 'cat_beverages', unit: 'jar', costPrice: 155, sellingPrice: 185, mrp: 195, currentStock: 12, minThreshold: 4, barcode: '8901058861014', supplierId: 'sup_4' },
  { name: 'Bru Instant Coffee Powder 100g Pouch', nameHindi: '???? ???????? ???? 100 ?????', categoryId: 'cat_beverages', unit: 'pouch', costPrice: 175, sellingPrice: 210, mrp: 225, currentStock: 10, minThreshold: 4, barcode: '8901030030018', supplierId: 'sup_5' },
  { name: 'Rooh Afza Sharbat 750ml Bottle', nameHindi: '??? ???? ????? 750 ????', categoryId: 'cat_beverages', unit: 'bottle', costPrice: 145, sellingPrice: 175, mrp: 190, currentStock: 8, minThreshold: 3, barcode: '8901458001016', supplierId: 'sup_1' },
  { name: 'Glucon-D Instant Energy Tangy Orange 500g', nameHindi: '???????-?? ????? 500 ?????', categoryId: 'cat_beverages', unit: 'box', costPrice: 125, sellingPrice: 150, mrp: 165, currentStock: 11, minThreshold: 4, barcode: '8901235001013', supplierId: 'sup_5' },
  { name: 'Rasna Fruit Plus Orange Powder 500g', nameHindi: '???? ????? ????? 500 ?????', categoryId: 'cat_beverages', unit: 'pouch', costPrice: 95, sellingPrice: 120, mrp: 135, currentStock: 14, minThreshold: 5, barcode: '8901314001017', supplierId: 'sup_1' },
  { name: 'Bournvita Health Drink 500g Jar', nameHindi: '????????? ????? ?????? 500 ?????', categoryId: 'cat_beverages', unit: 'jar', costPrice: 210, sellingPrice: 245, mrp: 265, currentStock: 10, minThreshold: 4, barcode: '8901233020016', supplierId: 'sup_4' },
  { name: 'Horlicks Classic Malt 500g Refill', nameHindi: '????????? ??????? 500 ?????', categoryId: 'cat_beverages', unit: 'pouch', costPrice: 215, sellingPrice: 250, mrp: 270, currentStock: 9, minThreshold: 4, barcode: '8901571001013', supplierId: 'sup_5' },

  // Sugar & Sweeteners (6 items)
  { name: 'Madhur Pure & Hygienic Sugar 1kg', nameHindi: '???? ??????? ???? 1 ????', categoryId: 'cat_sugar', unit: 'packet', costPrice: 42, sellingPrice: 48, mrp: 55, currentStock: 50, minThreshold: 15, barcode: '8906005201015', supplierId: 'sup_1' },
  { name: 'Loose Crystal Sugar / Cheeni 1kg', nameHindi: '???? ???? 1 ????', categoryId: 'cat_sugar', unit: 'kg', costPrice: 38, sellingPrice: 44, mrp: 46, currentStock: 140, minThreshold: 40, barcode: 'LOC-SUGAR-01', supplierId: 'sup_1' },
  { name: 'Pure Desi Gur / Jaggery Cubes 1kg', nameHindi: '???? ??? ?? ??? 1 ????', categoryId: 'cat_sugar', unit: 'kg', costPrice: 52, sellingPrice: 65, mrp: 70, currentStock: 25, minThreshold: 8, barcode: 'LOC-GUR-01', supplierId: 'sup_1' },
  { name: 'Dabur 100% Pure Honey 500g Glass Jar', nameHindi: '???? ????? ??? 500 ?????', categoryId: 'cat_sugar', unit: 'jar', costPrice: 195, sellingPrice: 235, mrp: 260, currentStock: 12, minThreshold: 4, barcode: '8901207010011', supplierId: 'sup_5' },
  { name: 'Patanjali Pure Honey 500g Squeezy', nameHindi: '?????? ??? 500 ?????', categoryId: 'cat_sugar', unit: 'bottle', costPrice: 180, sellingPrice: 215, mrp: 235, currentStock: 14, minThreshold: 4, barcode: '8904109450028', supplierId: 'sup_2' },
  { name: 'Sugar Free Gold Low Calorie Sweetener 100 Pellets', nameHindi: '???? ???? ????? 100 ???????', categoryId: 'cat_sugar', unit: 'dispenser', costPrice: 135, sellingPrice: 160, mrp: 175, currentStock: 8, minThreshold: 3, barcode: '8901236001012', supplierId: 'sup_5' },

  // Personal & Oral Care (10 items)
  { name: 'Dettol Original Bathing Soap 125g (Pack of 3)', nameHindi: '????? ????? 125 ????? (3 ?? ???)', categoryId: 'cat_personal', unit: 'pack', costPrice: 120, sellingPrice: 145, mrp: 160, currentStock: 22, minThreshold: 6, barcode: '8901396010013', supplierId: 'sup_5' },
  { name: 'Lifebuoy Total Germ Protection Soap 100g', nameHindi: '??????? ????? 100 ?????', categoryId: 'cat_personal', unit: 'piece', costPrice: 26, sellingPrice: 32, mrp: 36, currentStock: 35, minThreshold: 10, barcode: '8901030040017', supplierId: 'sup_5' },
  { name: 'Lux Rose & Vitamin E Beauty Soap 100g', nameHindi: '???? ????? ????? 100 ?????', categoryId: 'cat_personal', unit: 'piece', costPrice: 30, sellingPrice: 38, mrp: 42, currentStock: 26, minThreshold: 8, barcode: '8901030040024', supplierId: 'sup_5' },
  { name: 'Colgate Strong Teeth Toothpaste 200g Saver', nameHindi: '?????? ???????? 200 ?????', categoryId: 'cat_personal', unit: 'tube', costPrice: 95, sellingPrice: 115, mrp: 128, currentStock: 30, minThreshold: 10, barcode: '8901314010019', supplierId: 'sup_5' },
  { name: 'Pepsodent Germi Check Toothpaste 150g', nameHindi: '?????????? ???????? 150 ?????', categoryId: 'cat_personal', unit: 'tube', costPrice: 72, sellingPrice: 88, mrp: 98, currentStock: 18, minThreshold: 6, barcode: '8901030050016', supplierId: 'sup_5' },
  { name: 'Clinic Plus Strong & Long Shampoo 340ml', nameHindi: '??????? ???? ?????? 340 ????', categoryId: 'cat_personal', unit: 'bottle', costPrice: 175, sellingPrice: 210, mrp: 235, currentStock: 14, minThreshold: 5, barcode: '8901030060015', supplierId: 'sup_5' },
  { name: 'Head & Shoulders Anti-Dandruff Cool Menthol 180ml', nameHindi: '??? ??? ???????? ?????? 180 ????', categoryId: 'cat_personal', unit: 'bottle', costPrice: 155, sellingPrice: 185, mrp: 205, currentStock: 12, minThreshold: 4, barcode: '8901491103012', supplierId: 'sup_5' },
  { name: 'Parachute 100% Pure Coconut Hair Oil 200ml', nameHindi: '??????? ?????? ??? 200 ????', categoryId: 'cat_personal', unit: 'bottle', costPrice: 78, sellingPrice: 92, mrp: 102, currentStock: 25, minThreshold: 8, barcode: '8901088020010', supplierId: 'sup_5' },
  { name: 'Bajaj Almond Drops Non-Sticky Hair Oil 190ml', nameHindi: '???? ????? ??? 190 ????', categoryId: 'cat_personal', unit: 'bottle', costPrice: 140, sellingPrice: 170, mrp: 190, currentStock: 16, minThreshold: 5, barcode: '8906014420018', supplierId: 'sup_5' },
  { name: 'Ponds Pure White Anti-Pollution Face Wash 100g', nameHindi: '??????? ??? ??? 100 ?????', categoryId: 'cat_personal', unit: 'tube', costPrice: 130, sellingPrice: 160, mrp: 180, currentStock: 10, minThreshold: 4, barcode: '8901030070014', supplierId: 'sup_5' },

  // Cleaning & Household (10 items)
  { name: 'Surf Excel Easy Wash Detergent Powder 1kg', nameHindi: '???? ?????? ????????? ????? 1 ????', categoryId: 'cat_cleaning', unit: 'pouch', costPrice: 108, sellingPrice: 130, mrp: 145, currentStock: 28, minThreshold: 8, barcode: '8901030080013', supplierId: 'sup_5' },
  { name: 'Ariel Complete Detergent Washing Powder 1kg', nameHindi: '????? ?????? ????? 1 ????', categoryId: 'cat_cleaning', unit: 'pouch', costPrice: 135, sellingPrice: 165, mrp: 185, currentStock: 20, minThreshold: 6, barcode: '8901491104019', supplierId: 'sup_5' },
  { name: 'Ghadi Detergent Powder 1kg Super Value', nameHindi: '???? ????????? ????? 1 ????', categoryId: 'cat_cleaning', unit: 'pouch', costPrice: 52, sellingPrice: 65, mrp: 72, currentStock: 40, minThreshold: 12, barcode: '8906014430017', supplierId: 'sup_1' },
  { name: 'Vim Dishwash Liquid Lemon Gel 500ml', nameHindi: '??? ??????? ??? 500 ????', categoryId: 'cat_cleaning', unit: 'bottle', costPrice: 95, sellingPrice: 115, mrp: 130, currentStock: 22, minThreshold: 6, barcode: '8901030090012', supplierId: 'sup_5' },
  { name: 'Vim Dishwash Bar 150g (Pack of 3)', nameHindi: '??? ????? ??? ????? 150 ????? (3 ???)', categoryId: 'cat_cleaning', unit: 'pack', costPrice: 28, sellingPrice: 35, mrp: 40, currentStock: 35, minThreshold: 10, barcode: '8901030090029', supplierId: 'sup_5' },
  { name: 'Harpic Power Plus Toilet Cleaner Original 500ml', nameHindi: '??????? ?????? ?????? 500 ????', categoryId: 'cat_cleaning', unit: 'bottle', costPrice: 78, sellingPrice: 95, mrp: 105, currentStock: 24, minThreshold: 6, barcode: '8901396020012', supplierId: 'sup_5' },
  { name: 'Lizol Citrus Floor Cleaner Disinfectant 500ml', nameHindi: '?????? ????? ?????? 500 ????', categoryId: 'cat_cleaning', unit: 'bottle', costPrice: 85, sellingPrice: 105, mrp: 118, currentStock: 18, minThreshold: 6, barcode: '8901396030011', supplierId: 'sup_5' },
  { name: 'GoodKnight Gold Flash Liquid Mosquito Refill (45ml x 2)', nameHindi: '??????? ????? ????? 2 ???', categoryId: 'cat_cleaning', unit: 'pack', costPrice: 135, sellingPrice: 165, mrp: 180, currentStock: 15, minThreshold: 5, barcode: '8901023010014', supplierId: 'sup_5' },
  { name: 'Cycle Pure Agarbatti Yagna Fragrance Box', nameHindi: '?????? ???????? ?????', categoryId: 'cat_cleaning', unit: 'box', costPrice: 42, sellingPrice: 55, mrp: 60, currentStock: 30, minThreshold: 10, barcode: '8901844001018', supplierId: 'sup_1' },
  { name: 'Scotch-Brite Heavy Duty Scrub Pad (Pack of 3)', nameHindi: '????? ?????? ??????? (3 ?? ???)', categoryId: 'cat_cleaning', unit: 'pack', costPrice: 35, sellingPrice: 45, mrp: 50, currentStock: 28, minThreshold: 8, barcode: '8901361001015', supplierId: 'sup_5' }
];

function seedDatabase(shopId = 'shp_demomart') {
  // Clear collections for clean test
  memoryStore.categories.clear();
  memoryStore.suppliers.clear();
  memoryStore.products.clear();
  memoryStore.stockMovements = [];

  // Seed Suppliers
  for (const sup of sampleSuppliers) {
    memoryStore.suppliers.set(sup.id, {
      ...sup,
      shopId,
      isActive: true,
      createdAt: new Date().toISOString()
    });
  }

  // Seed Categories
  for (const cat of sampleCategories) {
    memoryStore.categories.set(cat.id, {
      ...cat,
      shopId,
      createdAt: new Date().toISOString()
    });
  }

  // Seed Products
  let count = 0;
  for (const prod of standardProducts) {
    count++;
    const productId = `prod_${count}`;
    const category = memoryStore.categories.get(prod.categoryId);
    const supplier = memoryStore.suppliers.get(prod.supplierId);

    const productRecord = {
      id: productId,
      shopId,
      categoryId: prod.categoryId,
      categoryName: category ? category.name : null,
      supplierId: prod.supplierId,
      supplierName: supplier ? supplier.name : null,
      name: prod.name,
      nameHindi: prod.nameHindi,
      barcode: prod.barcode,
      sku: `SKU-${count.toString().padStart(4, '0')}`,
      unit: prod.unit,
      costPrice: prod.costPrice,
      sellingPrice: prod.sellingPrice,
      mrp: prod.mrp,
      gstRate: 0,
      currentStock: prod.currentStock,
      minThreshold: prod.minThreshold,
      reorderQty: prod.minThreshold * 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryStore.products.set(productId, productRecord);

    // Initial stock movement record
    memoryStore.stockMovements.push({
      id: `mov_${count}`,
      shopId,
      productId,
      productName: prod.name,
      quantityBefore: 0,
      deltaQuantity: prod.currentStock,
      quantityAfter: prod.currentStock,
      type: 'PURCHASE_IN',
      reason: 'Initial Synthetic Stock Ingestion (DemoMart)',
      createdAt: new Date().toISOString()
    });
  }

  return {
    suppliersCount: sampleSuppliers.length,
    categoriesCount: sampleCategories.length,
    productsCount: count,
    stockMovementsCount: memoryStore.stockMovements.length
  };
}

module.exports = {
  seedDatabase,
  sampleSuppliers,
  sampleCategories,
  standardProducts
};
