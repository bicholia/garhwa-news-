import { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'
import '@/app/global.css'

export const metadata: Metadata = {
    title: 'सुधार नीति | गढ़वा पलामू न्यूज़',
    description: 'गढ़वा पलामू न्यूज़ में गलती होने पर सुधार की प्रक्रिया। त्रुटि रिपोर्ट करने का तरीका जानें।',
}

export default function CorrectionsPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">सुधार नीति</h1>
                        <p className="text-gray-600">पारदर्शिता ही हमारी पहचान है</p>
                        <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                        <section style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1.5rem', background: '#fffbeb', padding: '1.5rem', borderRadius: '0 8px 8px 0' }}>
                            <p className="text-gray-800 text-lg font-semibold">
                                गलतियाँ स्वीकार करना और उन्हें सुधारना एक जिम्मेदार समाचार संगठन का कर्तव्य है।
                                हम अपनी त्रुटियों को पारदर्शी तरीके से सुधारते हैं।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">1. सुधार की प्रक्रिया</h2>
                            <p className="text-gray-700 leading-relaxed">
                                जब हमें किसी तथ्यात्मक त्रुटि का पता चलता है, तो हम लेख को तुरंत अपडेट करते हैं
                                और लेख के अंत में "सुधार" नोट जोड़ते हैं।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-3">2. त्रुटि रिपोर्ट करें</h2>
                            <p className="text-gray-700 leading-relaxed">
                                यदि आपको किसी समाचार में कोई गलती मिलती है, तो कृपया हमें निम्नलिखित जानकारी दें:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                                <li>लेख का शीर्षक और लिंक</li>
                                <li>गलत जानकारी क्या है</li>
                                <li>सही जानकारी (संभव हो तो स्रोत के साथ)</li>
                            </ul>
                        </section>

                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">संपर्क सूत्र</h2>
                            <p className="text-gray-700">
                                <strong>ईमेल:</strong> bicholia03@gmail.com
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
