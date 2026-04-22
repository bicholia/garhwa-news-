import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'संपादकीय नीति | ThinkIndia.press',
    description: 'ThinkIndia.press (थिंक इंडिया) की संपादकीय नीति। हमारे समाचार चयन और तथ्य-जांच के सिद्धांतों के बारे में जानें।',
}

import PublicLayout from '@/components/PublicLayout'
import '@/app/global.css'

export default function EditorialPolicyPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">संपादकीय नीति</h1>
                        <p className="text-gray-600">विश्वसनीयता के लिए हमारी प्रतिबद्धता</p>
                        <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                        <section style={{ borderLeft: '4px solid #dc2626', paddingLeft: '1.5rem', background: '#fef2f2', padding: '1.5rem', borderRadius: '0 8px 8px 0' }}>
                            <p className="text-gray-800 text-lg font-semibold">
                                ThinkIndia.press (थिंक इंडिया) सटीक, निष्पक्ष और स्वतंत्र पत्रकारिता के लिए प्रतिबद्ध है।
                                हमारा हर लेख इन सिद्धांतों का पालन करता है।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">1. तथ्य-जांच</h2>
                            <p className="text-gray-700 leading-relaxed">
                                प्रकाशन से पहले प्रत्येक समाचार की पुष्टि कम से कम दो स्वतंत्र स्रोतों से की जाती है।
                                हम आधिकारिक दस्तावेजों और प्रत्यक्षदर्शियों के बयानों को प्राथमिकता देते हैं।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">2. निष्पक्षता</h2>
                            <p className="text-gray-700 leading-relaxed">
                                हम किसी भी राजनीतिक दल, धर्म या जाति के प्रति पक्षपाती नहीं हैं।
                                विवादित मामलों में हम सभी पक्षों का पक्ष सुनने और प्रकाशित करने का प्रयास करते हैं।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">3. संवेदनशीलता</h2>
                            <p className="text-gray-700 leading-relaxed">
                                हम पीड़ितों और नाबालिगों की पहचान सुरक्षित रखते हैं। सांप्रदायिक सद्भाव बिगाड़ने
                                वाली सामग्री को हम प्रकाशित नहीं करते।
                            </p>
                        </section>

                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">शिकायत निवारण</h2>
                            <p className="text-gray-700">
                                संपादकीय सामग्री से संबंधित किसी भी शिकायत के लिए:
                                <br />
                                <strong>संपर्क:</strong> हमारी वेबसाइट के 'Contact' फॉर्म के माध्यम से हमसे संपर्क करें।
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
