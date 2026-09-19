/**
 * Product & Text Sanitizer and Hindi Name Formatter
 */

export const HINDI_FALLBACK_MAP: Record<string, string> = {
  'Aashirvaad Shudh Chakki Atta 10kg': 'आशीर्वाद शुद्ध चक्की आटा 10kg',
  'Aashirvaad Shudh Chakki Atta 5kg': 'आशीर्वाद शुद्ध चक्की आटा 5kg',
  'Fortune Chakki Fresh Atta 10kg': 'फॉर्च्यून चक्की फ्रेश आटा 10kg',
  'India Gate Basmati Rice Classic 5kg': 'इंडिया गेट बासमती चावल 5kg',
  'Daawat Rozana Super Basmati Rice 5kg': 'दावत रोजाना बासमती चावल 5kg',
  'Kolam Daily Steam Rice 10kg': 'कोलम स्टीम चावल 10kg',
  'Rajdhani Sooji / Rawa 500g': 'राजधानी सूजी / रवा 500g',
  'Rajdhani Besan 500g': 'राजधानी बेसन 500g',
  'Rajdhani Maida 500g': 'राजधानी मैदा 500g',
  'Loose Wheat / Sabut Gehun 1kg': 'खुला साबुत गेहूं 1kg',
  'Loose Poha / Flattened Rice 1kg': 'खुला पोहा 1kg',
  'Quaker Rolled Oats 1kg': 'क्वेकर ओट्स 1kg',
  'Fortune Kachi Ghani Mustard Oil 1L': 'फॉर्च्यून कच्ची घानी सरसों तेल 1L',
  'Fortune Sunlite Refined Sunflower Oil 1L': 'फॉर्च्यून सनलाइट रिफाइंड तेल 1L',
  'Engine Brand Pure Mustard Oil 1L': 'इंजन ब्रांड शुद्ध सरसों तेल 1L',
  'Saffola Gold Pro Healthy Oil 1L': 'सफोला गोल्ड प्रो कुकिंग तेल 1L',
  'Amul Pure Ghee 1L Tin': 'अमूल शुद्ध देसी घी 1L टिन',
  'Amul Pure Ghee 500ml Pouch': 'अमूल शुद्ध देसी घी 500ml पाउच',
  'Patanjali Cow Ghee 1L': 'पतंजलि गाय का शुद्ध घी 1L',
  'Dalda Vanaspati Ghee 1L Pouch': 'डालडा वनस्पति घी 1L पाउच',
  'Fortune Soya Health Refined Oil 1L': 'फॉर्च्यून सोयाबीन तेल 1L',
  'Dhara Kachi Ghani Mustard Oil 1L': 'धारा कच्ची घानी सरसों तेल 1L',
  'Tata Salt Vacuum Evaporated 1kg': 'टाटा नमक 1kg',
  'Tata Salt Lite Low Sodium 1kg': 'टाटा नमक लाइट 1kg',
  'MDH Deggi Mirch Powder 100g': 'एमडीएच देगी मिर्च 100g',
  'MDH Haldi / Turmeric Powder 100g': 'एमडीएच हल्दी पाउडर 100g',
  'MDH Dhania / Coriander Powder 100g': 'एमडीएच धनिया पाउडर 100g',
  'Everest Garam Masala 100g': 'एवरेस्ट गरम मसाला 100g',
  'Everest Chaat Masala 100g': 'एवरेस्ट चाट मसाला 100g',
  'Everest Kasuri Methi 50g': 'एवरेस्ट कसूरी मेथी 50g',
  'Catch Black Pepper / Kali Mirch 100g': 'कैच काली मिर्च पाउडर 100g',
  'LG Hing / Compounded Asafoetida 50g': 'एलजी शुद्ध हींग 50g',
  'Loose Cumin / Jeera Sabut 100g': 'खुला साबुत जीरा 100g',
  'Loose Mustard Seeds / Rai 100g': 'खुली राई / सरसों दाना 100g',
  'Loose Cloves / Laung 50g': 'खुली लौंग 50g',
  'Loose Green Cardamom / Elaichi 50g': 'खुली हरी इलायची 50g',
  'Tata Sampann Unpolished Toor Dal 1kg': 'टाटा संपन्न तूर दाल / अरहर 1kg',
  'Tata Sampann Moong Dal Dhuli 1kg': 'टाटा संपन्न मूंग दाल धुली 1kg',
  'Tata Sampann Chana Dal 1kg': 'टाटा संपन्न चना दाल 1kg',
  'Tata Sampann Urad Dal Split 1kg': 'टाटा संपन्न उड़द दाल 1kg',
  'Tata Sampann Kabuli Chana 1kg': 'टाटा संपन्न काबुली चना / छोले 1kg',
  'Tata Sampann Rajma Red 1kg': 'टाटा संपन्न कश्मीरी राजमा 1kg',
  'Loose Kala Chana Desi 1kg': 'खुला देसी काला चना 1kg',
  'Loose Masoor Dal Malki 1kg': 'खुली मसूर दाल 1kg',
  'Loose White Soya Chunks 1kg': 'खुली सोयाबीन बड़ी 1kg',
  'Nutrela Soya Chunks 200g Box': 'न्यूट्रिला सोया चंक्स 200g',
  'Amul Taaza Fresh Toned Milk 500ml': 'अमूल ताजा टोंड दूध 500ml',
  'Amul Gold Full Cream Milk 500ml': 'अमूल गोल्ड फुल क्रीम दूध 500ml',
  'Amul Salted Butter 100g': 'अमूल बटर मक्खन 100g',
  'Amul Masti Dahi Pouch 400g': 'अमूल मस्ती ताजा दही 400g',
  'Amul Malai Paneer 200g Fresh': 'अमूल मलाई पनीर 200g',
  'Amul Cheese Slices 200g (10 Slices)': 'अमूल चीज स्लाइस 200g',
  'Britannia Daily Fresh White Bread 400g': 'ब्रिटानिया वाइट ब्रेड 400g',
  'Britannia 100% Whole Wheat Bread 400g': 'ब्रिटानिया आटा ब्रेड 400g',
  'Mother Dairy Classic Curd 400g Cup': 'मदर डेयरी दही 400g कप',
  'Amul Kool Elaichi Milk 180ml Can': 'अमूल कूल इलायची दूध 180ml',
  'Parle-G Gold Biscuits 1kg Family Pack': 'पारले-जी गोल्ड बिस्कुट 1kg',
  'Britannia Marie Gold 300g Super Saver': 'ब्रिटानिया मारी गोल्ड 300g',
  'Britannia Good Day Butter Cookies 200g': 'गुड डे बटर कुकीज 200g',
  'Haldirams Nagpur Bhujia Sev 400g': 'हल्दीराम नागपुर भुजिया सेव 400g',
  'Haldirams All in One Mixture 400g': 'हल्दीराम ऑल इन वन मिक्सचर 400g',
  'Maggi 2-Minute Masala Noodles 4-Pack (280g)': 'मैगी 2-मिनट मसाला नूडल्स 4 पैक',
  'Yippee Magic Masala Noodles 240g': 'यिप्पी मैजिक मसाला नूडल्स 240g',
  'Lays India Magic Masala Chips 50g': 'लेज इंडिया मैजिक मसाला चिप्स 50g',
  'Kurkure Masala Munch 85g': 'कुरकुरे मसाला मंच 85g',
  'Cadbury Dairy Milk Chocolate 50g': 'कैडबरी डेयरी मिल्क चॉकलेट 50g',
  'Cadbury 5 Star Chocolate 40g': 'कैडबरी 5 स्टार चॉकलेट 40g',
  'Sunfeast Dark Fantasy Choco Fills 300g': 'सनफीस्ट डार्क फैंटेसी 300g',
  'Brooke Bond Red Label Tea 500g': 'रेड लेबल चाय पत्ती 500g',
  'Tata Tea Gold Leaf Tea 500g': 'टाटा टी गोल्ड प्रीमियम चाय 500g',
  'Wagh Bakri Strong CTC Tea 500g': 'वाघ बकरी कड़क चाय 500g',
  'Nescafe Classic Instant Coffee 50g Jar': 'नेस्कैफे क्लासिक कॉफी 50g जार',
  'Bru Instant Coffee Powder 100g Pouch': 'ब्रू इंस्टेंट कॉफी 100g पाउच',
  'Rooh Afza Sharbat 750ml Bottle': 'रूह अफ़ज़ा शरबत 750ml',
  'Glucon-D Instant Energy Tangy Orange 500g': 'ग्लूकॉन-डी ऑरेंज 500g',
  'Rasna Fruit Plus Orange Powder 500g': 'रसना फ्रूट प्लस 500g',
  'Bournvita Health Drink 500g Jar': 'बोर्नविटा हेल्थ ड्रिंक 500g',
  'Horlicks Classic Malt 500g Refill': 'हॉर्लिक्स क्लासिक माल्ट 500g',
  'Madhur Pure & Hygienic Sugar 1kg': 'मधुर शुद्ध चीनी 1kg',
  'Loose Crystal Sugar / Cheeni 1kg': 'खुली चीनी 1kg',
  'Pure Desi Gur / Jaggery Cubes 1kg': 'शुद्ध देसी गुड़ 1kg',
  'Dabur 100% Pure Honey 500g Glass Jar': 'डाबर शुद्ध शहद 500g जार',
  'Patanjali Pure Honey 500g Squeezy': 'पतंजलि शुद्ध शहद 500g',
  'Sugar Free Gold Low Calorie Sweetener 100 Pellets': 'शुगर फ्री गोल्ड 100 गोलियां',
  'Dettol Original Bathing Soap 125g (Pack of 3)': 'डेटॉल साबुन 125g (3 का पैक)',
  'Lifebuoy Total Germ Protection Soap 100g': 'लाइफबॉय साबुन 100g',
  'Lux Rose & Vitamin E Beauty Soap 100g': 'लक्स रोज ब्यूटी साबुन 100g',
  'Colgate Strong Teeth Toothpaste 200g Saver': 'कोलगेट टूथपेस्ट 200g',
  'Pepsodent Germi Check Toothpaste 150g': 'पेप्सोडेंट टूथपेस्ट 150g',
  'Clinic Plus Strong & Long Shampoo 340ml': 'क्लीनिक प्लस शैम्पू 340ml',
  'Head & Shoulders Anti-Dandruff Cool Menthol 180ml': 'हेड एंड शोल्डर्स शैम्पू 180ml',
  'Parachute 100% Pure Coconut Hair Oil 200ml': 'पैराशूट नारियल तेल 200ml',
  'Bajaj Almond Drops Non-Sticky Hair Oil 190ml': 'बजाज बादाम तेल 190ml',
  'Ponds Pure White Anti-Pollution Face Wash 100g': 'पॉन्ड्स फेस वॉश 100g',
  'Surf Excel Easy Wash Detergent Powder 1kg': 'सर्फ एक्सेल डिटर्जेंट पाउडर 1kg',
  'Ariel Complete Detergent Washing Powder 1kg': 'एरियल वॉशिंग पाउडर 1kg',
  'Ghadi Detergent Powder 1kg Super Value': 'घड़ी डिटर्जेंट पाउडर 1kg',
  'Vim Dishwash Liquid Lemon Gel 500ml': 'विम डिशवॉश जेल 500ml',
  'Vim Dishwash Bar 150g (Pack of 3)': 'विम बर्तन बार साबुन 150g (3 पैक)',
  'Harpic Power Plus Toilet Cleaner Original 500ml': 'हार्पिक टॉयलेट क्लीनर 500ml',
  'Lizol Citrus Floor Cleaner Disinfectant 500ml': 'लाइज़ोल फ्लोर क्लीनर 500ml',
  'GoodKnight Gold Flash Liquid Mosquito Refill (45ml x 2)': 'गुडनाइट लिक्विड रिफिल 2 पैक',
  'Cycle Pure Agarbatti Yagna Fragrance Box': 'साइकिल अगरबत्ती सुगंधित',
  'Scotch-Brite Heavy Duty Scrub Pad (Pack of 3)': 'स्कॉच ब्राइट स्क्रबर (3 का पैक)',
};

/**
 * Returns a clean, guaranteed non-corrupted Hindi name for a product.
 * If the provided nameHindi contains '???' or corrupted encoding, it uses fallback or product name.
 */
export function getCleanHindiName(product: { name: string; nameHindi?: string; hindiName?: string }): string {
  const rawHindi = product.nameHindi || product.hindiName || '';
  
  // If rawHindi is clean (no '??' or corrupt symbols), return it
  if (rawHindi && !/\?{2,}/.test(rawHindi) && !/^[\?\s\d\(\)\-\.]+$/.test(rawHindi)) {
    return rawHindi;
  }

  // Check fallback dictionary
  if (product.name && HINDI_FALLBACK_MAP[product.name]) {
    return HINDI_FALLBACK_MAP[product.name];
  }

  // Return product name if no valid Hindi translation exists
  return product.name || '';
}

/**
 * Formats a product display title considering the active language
 */
export function formatProductTitle(product: { name: string; nameHindi?: string; hindiName?: string }, lang: 'hi' | 'en'): string {
  if (lang === 'hi') {
    const hindi = getCleanHindiName(product);
    if (hindi && hindi !== product.name) {
      return `${hindi} (${product.name})`;
    }
    return product.name;
  }
  return product.name;
}
