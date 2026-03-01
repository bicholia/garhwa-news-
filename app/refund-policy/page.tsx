import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'रिफंड नीति | गढ़वा पलामू न्यूज़',
    description: 'NR Daily News की रिफंड और कैंसलेशन नीति। विज्ञापन और अन्य सेवाओं के लिए भुगतान संबंधी नियम।',
}

import PublicLayout from '@/components/PublicLayout'
import '@/app/global.css'

export default function RefundPolicyPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">रिफंड और कैंसलेशन नीति</h1>
                        <p className="text-gray-600">अंतिम अपडेट: 24 फरवरी, 2026</p>
                        <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-10 space-y-10 border border-gray-100">
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm">✓</span>
                                विज्ञापन सेवाएं (Advertising)
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                NR Daily News पर बुक किए गए विज्ञापनों के लिए एक बार भुगतान हो जाने के बाद उसे रद्द (Cancel) नहीं किया जा सकता। यदि तकनीकी कारणों से आपका विज्ञापन लाइव नहीं हो पाता है, तो हम उसे अगले उपलब्ध स्लॉट में रिशेड्यूल करेंगे।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm">✓</span>
                                रिफंड की स्थिति
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                विशेष परिस्थितियों में, यदि प्रबंधन रिफंड के लिए सहमत होता है, तो राशि आपके मूल भुगतान माध्यम में 7-10 कार्य दिवसों (Working Days) के भीतर वापस कर दी जाएगी।
                            </p>
                        </section>

                        <section className="bg-yellow-50 p-8 rounded-3xl border border-yellow-200">
                            <h2 className="text-xl font-black mb-2 text-yellow-900">महत्वपूर्ण सूचना</h2>
                            <p className="text-yellow-800">चूंकि हम डिजिटल सेवाएं प्रदान करते हैं, इसलिए "कंटेंट पब्लिशिंग" के मामलों में कोई रिफंड स्वीकार्य नहीं है।</p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
