import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'उपयोग की शर्तें | गढ़वा पलामू न्यूज़',
    description: 'गढ़वा पलामू न्यूज़ की उपयोग की शर्तें। हमारी वेबसाइट के उपयोग से संबंधित नियम और कानून।',
}

import PublicLayout from '@/components/PublicLayout'
import '@/app/global.css'

export default function TermsPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">उपयोग की शर्तें</h1>
                        <p className="text-gray-600">अंतिम अपडेट: 24 फरवरी, 2026</p>
                        <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-10 space-y-10 border border-gray-100">
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm">01</span>
                                सामग्री का स्वामित्व (Copyright)
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                इस वेबसाइट पर प्रकाशित सभी मूल लेख, शोध, फोटो और वीडियो <strong>NR Daily News</strong> की बौद्धिक संपदा (Intellectual Property) हैं। बिना लिखित अनुमति के हमारे कंटेंट का व्यावसायिक उपयोग या कॉपी-पेस्ट करना कानूनी अपराध है। आप सोशल मीडिया पर न्यूज़ शेयर कर सकते हैं, बशर्ते आप हमारी वेबसाइट का लिंक साथ में दें।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm">02</span>
                                उपयोगकर्ता आचरण (User Conduct)
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                हमारी वेबसाइट पर कमेंट करते समय या न्यूज़ टिप भेजते समय निम्नलिखित वर्जित है:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                                <li>अभद्र या जातिसूचक शब्दों का प्रयोग।</li>
                                <li>झूठी खबरें या अफवाह फैलाना।</li>
                                <li>किसी व्यक्ति या समुदाय की छवि खराब करना।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm">03</span>
                                जवाबदेही की सीमा (Disclaimer)
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                हम खबरों की सत्यता की पुष्टि के लिए हर संभव प्रयास करते हैं, लेकिन किसी भी प्रकार की अनजाने में हुई तथ्यात्मक त्रुटि के लिए प्रकाशक या संपादक कानूनी रूप से जिम्मेदार नहीं होंगे। हम बाहरी वेबसाइटों के लिंक (Ads) की सामग्री के लिए भी जिम्मेदार नहीं हैं।
                            </p>
                        </section>

                        <section className="bg-gray-100 p-8 rounded-3xl border-2 border-dashed border-gray-300">
                            <h2 className="text-xl font-black mb-2 text-gray-900">कानूनी क्षेत्राधिकार (Jurisdiction)</h2>
                            <p className="text-gray-600">किसी भी कानूनी विवाद की स्थिति में न्यायिक क्षेत्र <strong>गढ़वा (झारखंड)</strong> की अदालतें होंगी।</p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
