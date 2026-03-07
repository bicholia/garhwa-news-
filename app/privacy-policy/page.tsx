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

                    <div className="bg-white rounded-2xl shadow-lg p-10 space-y-10 border border-gray-100">
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm">01</span>
                                परिचय और डेटा संग्रह
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                <strong>NR Daily News</strong> (गढ़वा पलामू न्यूज़) आपकी निजता (Privacy) का सम्मान करता है। जब आप हमारी वेबसाइट का उपयोग करते हैं, तो हम निम्नलिखित जानकारी एकत्र कर सकते हैं:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                                <li className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-600"><strong>लोकेशन डेटा:</strong> आपके क्षेत्र की सटीक खबरें दिखाने के लिए।</li>
                                <li className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-600"><strong>डिवाइस जानकारी:</strong> बेहतर यूजर एक्सपीरियंस के लिए।</li>
                                <li className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-600"><strong>लॉग्स:</strong> IP एड्रेस और ब्राउज़र टाइप (Security के लिए)।</li>
                                <li className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-600"><strong>संपर्क जानकारी:</strong> जब आप न्यूज़ टिप या फीडबैक देते हैं।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm">02</span>
                                डेटा का उपयोग (Usage)
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                हम आपके डेटा का उपयोग वेबसाइट की सुरक्षा सुनिश्चित करने, आपको विज्ञापन दिखाने (Google AdSense द्वारा), और भविष्य में आपको पर्सनलाइज्ड न्यूज़ अलर्ट भेजने के लिए करते हैं। हम कभी भी किसी तीसरे पक्ष (Third Party) को आपकी निजी जानकारी <strong>नहीं बेचते</strong>।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm">03</span>
                                कुकीज़ (Cookies)
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                हमारी वेबसाइट कुकीज़ का उपयोग करती है ताकि हम यह समझ सकें कि पाठक किस तरह की ख़बरों में रुचि रखते हैं। यह डेटा पूरी तरह से गोपनीय रहता है और विज्ञापनदाताओं के साथ केवल आंकड़ों के रूप में साझा किया जाता है।
                            </p>
                        </section>

                        <section className="bg-gray-900 text-white p-8 rounded-3xl">
                            <h2 className="text-2xl font-black mb-4">संपर्क सूत्र (Grievance Redressal)</h2>
                            <p className="mb-6 opacity-80">किसी भी प्रकार की आपत्ति या निजता संबंधी शिकायत के लिए हमें यहाँ लिखें:</p>
                            <div className="space-y-2 text-lg">
                                <p><strong>ईमेल:</strong> bicholia03@gmail.com</p>

                                <p><strong>स्थान:</strong> वार्ड नंबर 8, पुलिस लाइन के पास, गढ़वा, झारखंड - 822114</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
