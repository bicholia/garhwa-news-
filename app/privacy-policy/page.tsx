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
                                डेटा संग्रह (Data Collection)
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                <strong>NR Daily News</strong> आपकी निजता का सम्मान करता है। हम निम्नलिखित जानकारी एकत्र कर सकते हैं:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                                <li className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-600"><strong>लोकेशन:</strong> क्षेत्रीय समाचार दिखाने के लिए।</li>
                                <li className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-600"><strong>लॉग्स:</strong> IP एड्रेस और ब्राउज़र जानकारी (सुरक्षा के लिए)।</li>
                                <li className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-600"><strong>कुकीज़:</strong> बेहतर अनुभव और विज्ञापनों के लिए।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm">02</span>
                                AI और डेटा प्रोसेसिंग
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                हम समाचारों को बेहतर बनाने और स्वचालित रूप से स्थानीय जानकारी एकत्र करने के लिए <strong>Google Gemini AI</strong> का उपयोग करते हैं। 
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex gap-2">✅ समाचारों का विश्लेषण और पुनर्गठन Google के सुरक्षित AI सर्वर पर होता है।</li>
                                <li className="flex gap-2">✅ आपकी निजी जानकारी कभी भी AI ट्रेनिंग के लिए साझा नहीं की जाती।</li>
                                <li className="flex gap-2">✅ सभी डेटा <strong>Vercel Postgres</strong> (सुरक्षित क्लाउड स्टोरेज) पर स्टोर किया जाता है।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm">03</span>
                                आपकी जानकारी की सुरक्षा
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                हम कभी भी आपका डेटा किसी तीसरे पक्ष को <strong>नहीं बेचते</strong>। सभी डेटा एन्क्रिप्टेड है और केवल सेवा सुधार के लिए उपयोग किया जाता है।
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
