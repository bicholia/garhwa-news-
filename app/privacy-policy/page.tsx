import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'गोपनीयता नीति | गढ़वा पलामू न्यूज़',
    description: 'गढ़वा पलामू न्यूज़ की गोपनीयता नीति। जानिए हम आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और संरक्षित करते हैं।',
}

import PublicLayout from '@/components/PublicLayout'
import '@/app/global.css'

export default function PrivacyPolicyPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">गोपनीयता नीति</h1>
                        <p className="text-gray-600">अंतिम अपडेट: 24 फरवरी, 2026</p>
                        <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">1. परिचय</h2>
                            <p className="text-gray-700 leading-relaxed">
                                गढ़वा पलामू न्यूज़ (garhwapalamunews.com) आपकी निजता का सम्मान करता है।
                                यह नीति बताती है कि जब आप हमारी वेबसाइट पर जाते हैं, तो हम आपकी कौन सी व्यक्तिगत
                                जानकारी एकत्र करते हैं और उसका उपयोग कैसे करते हैं।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">2. जानकारी का संग्रह</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li><strong>व्यक्तिगत जानकारी:</strong> नाम, ईमेल पता (जब आप हमसे संपर्क करते हैं)</li>
                                <li><strong>लॉग डेटा:</strong> IP पता, ब्राउज़र प्रकार, विज़िट की तारीख और समय</li>
                                <li><strong>कुकीज़:</strong> बेहतर उपयोगकर्ता अनुभव के लिए छोटी फ़ाइलें</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">3. डेटा सुरक्षा</h2>
                            <p className="text-gray-700 leading-relaxed">
                                हम आपकी व्यक्तिगत जानकारी को अनधिकृत पहुंच या परिवर्तन से बचाने के लिए उचित सुरक्षा उपाय करते हैं।
                                हम कभी भी आपका डेटा तीसरे पक्ष को नहीं बेचते।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">4. संपर्क जानकारी</h2>
                            <p className="text-gray-700 leading-relaxed">
                                अगर आपके पास इस नीति से संबंधित कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
                            </p>
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p><strong>ईमेल:</strong> news@garhwa-news.vercel.app</p>
                                <p><strong>पता:</strong> वार्ड नंबर 8, पुलिस लाइन के पास, गढ़वा - 822114, झारखंड</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
