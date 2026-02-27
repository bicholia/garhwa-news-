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

                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">1. सामान्य नियम</h2>
                            <p className="text-gray-700 leading-relaxed">
                                इस वेबसाइट का उपयोग करके, आप इन शर्तों से पूरी तरह सहमत होते हैं।
                                यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">2. सामग्री का उपयोग</h2>
                            <p className="text-gray-700 leading-relaxed">
                                इस वेबसाइट पर प्रकाशित सभी सामग्री (लेख, फोटो, वीडियो) गढ़वा पलामू न्यूज़ की संपत्ति है।
                                बिना अनुमति के व्यावसायिक उपयोग प्रतिबंधित है। व्यक्तिगत और गैर-व्यावसायिक उपयोग के लिए
                                आप सामग्री साझा कर सकते हैं, बशर्ते आप उचित श्रेय (Credit) दें।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">3. जवाबदेही</h2>
                            <p className="text-gray-700 leading-relaxed">
                                हम सठीक और ताज़ा जानकारी देने का हर संभव प्रयास करते हैं, लेकिन किसी भी प्रकार की
                                अनजाने में हुई त्रुटि के लिए हम कानूनी रूप से जवाबदेह नहीं होंगे।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">4. बदलाव</h2>
                            <p className="text-gray-700 leading-relaxed">
                                हम इन शर्तों को कभी भी बिना पूर्व सूचना के अपडेट करने का अधिकार रखते हैं।
                                नियमित रूप से इस पृष्ठ की जांच करना आपकी जिम्मेदारी है।
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
