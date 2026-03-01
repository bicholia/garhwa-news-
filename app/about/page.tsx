import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'हमारे बारे में | गढ़वा पलामू न्यूज़',
    description:
        'गढ़वा और पलामू जिले की सबसे तेज और भरोसेमंद हिंदी समाचार वेबसाइट। जानिए हमारी टीम, मिशन और विजन के बारे में।',
    keywords: 'गढ़वा समाचार, पलामू न्यूज़, झारखंड हिंदी न्यूज़, स्थानीय पत्रकारिता',
    openGraph: {
        title: 'हमारे बारे में | गढ़वा पलामू न्यूज़',
        description: 'गढ़वा और पलामू की आवाज - आपका भरोसेमंद स्थानीय समाचार स्रोत',
    },
}

import PublicLayout from '@/components/PublicLayout'
import '@/app/global.css'
export default function AboutPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-black text-gray-900 mb-6 border-b-8 border-red-600 inline-block pb-2">
                            हमारी कहानी
                        </h1>
                        <p className="text-xl text-gray-600 mt-4 font-semibold">
                            गढ़वा-पलामू का अपना डिजिटल न्यूज़ नेटवर्क — <span className="text-red-600">NR Daily News</span>
                        </p>
                    </div>

                    {/* Founder's Story / Digital Upliftment */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
                        <div className="md:flex">
                            <div className="md:w-1/3 bg-red-600 p-12 flex flex-col justify-center text-white">
                                <h2 className="text-3xl font-black mb-4">Founder's Story</h2>
                                <div className="w-16 h-1 bg-white opacity-50 mb-6"></div>
                                <p className="text-red-100 italic">"हमारा सपना गढ़वा के हर घर को डिजिटल क्रांति से जोड़ना है।"</p>
                            </div>
                            <div className="md:w-2/3 p-10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">डिजिटल उत्थान (Digital Upliftment)</h2>
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    NR Daily News की शुरुआत एक छोटे से सपने के साथ हुई थी — गढ़वा और पलामू जैसे क्षेत्रों में सूचना के अभाव को मिटाना। हमने देखा कि हमारे क्षेत्र की खबरें बड़े मीडिया हाउसों में कहीं खो जाती थीं।
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    हमारा उद्देश्य केवल समाचार देना नहीं, बल्कि इस क्षेत्र का <strong>डिजिटल उत्थान (Digital Upliftment)</strong> करना है। हम स्थानीय युवाओं को डिजिटल पत्रकारिता से जोड़ रहे हैं और तकनीकी रूप से सशक्त बना रहे हैं ताकि हमारे जिले की आवाज़ पूरी दुनिया में गूंज सके।
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">हमारा मिशन</h2>
                        <p className="text-gray-700 leading-relaxed">
                            गढ़वा और पलामू जिले के लोगों तक <strong>सटीक, तेज और निष्पक्ष</strong> समाचार पहुंचाना।
                            हमारा लक्ष्य है कि हर छोटे से छोटे गांव की खबर भी दुनिया तक पहुंचे और
                            स्थानीय मुद्दों को मुख्यधारा में लाया जाए।
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">हमारा विजन</h2>
                        <p className="text-gray-700 leading-relaxed">
                            झारखंड के सबसे भरोसेमंद डिजिटल न्यूज़ प्लेटफॉर्म के रूप में उभरना।
                            हम चाहते हैं कि हर गढ़वा-पलामूवासी, चाहे वह दुनिया के किसी भी कोने में हो,
                            अपने घर की खबरें एक क्लिक पर पा सके।
                        </p>
                    </div>

                    {/* Team */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-red-600 mb-6">हमारी टीम</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-4">
                                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#dc2626' }}>R</div>
                                <div>
                                    <h3 className="font-bold text-lg">रूपेश कुमार</h3>
                                    <p className="text-gray-600 text-sm">संपादक एवं संस्थापक</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        10+ वर्षों का पत्रकारिता अनुभव
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#dc2626' }}>S</div>
                                <div>
                                    <h3 className="font-bold text-lg">संजय तिवारी</h3>
                                    <p className="text-gray-600 text-sm">
                                        वरिष्ठ संवाददाता (गढ़वा)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#dc2626' }}>P</div>
                                <div>
                                    <h3 className="font-bold text-lg">प्रीति सिंह</h3>
                                    <p className="text-gray-600 text-sm">
                                        संवाददाता (पलामू)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#dc2626' }}>A</div>
                                <div>
                                    <h3 className="font-bold text-lg">अमित कुमार</h3>
                                    <p className="text-gray-600 text-sm">तकनीकी प्रमुख</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="bg-red-600 text-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">हमारे मूल्य</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 font-semibold">सटीकता</div>
                            <div className="p-3 font-semibold">निष्पक्षता</div>
                            <div className="p-3 font-semibold">तेजी</div>
                            <div className="p-3 font-semibold">विश्वास</div>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    )
}
