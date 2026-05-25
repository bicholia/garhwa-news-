import { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'
import { AlertTriangle, Clock, RefreshCcw, Mail } from 'lucide-react'

export const metadata: Metadata = {
    title: 'सुधार नीति (Corrections Policy) | ThinkIndia.press',
    description: 'ThinkIndia.press की सुधार नीति। गलतियों को सुधारने और पारदर्शिता बनाए रखने के लिए हमारी प्रतिबद्धता।',
}

export default function CorrectionsPolicyPage() {
    return (
        <PublicLayout>
            <div className="container py-10 lg:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            Editorial Standards
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-news-text dark:text-white serif-font tracking-tight mb-4">
                            सुधार <span className="text-brand-red">नीति</span>
                        </h1>
                        <p className="text-news-muted text-sm lg:text-base font-bold tracking-widest uppercase mb-4">Corrections Policy</p>
                        <p className="text-news-muted text-sm max-w-2xl mx-auto">
                            अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-brand-navy p-8 lg:p-12 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium">
                        
                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                            
                            {/* Intro */}
                            <p className="text-lg text-news-text dark:text-gray-300 font-medium leading-relaxed border-l-4 border-brand-red pl-6 py-2">
                                ThinkIndia.press (थिंक इंडिया) में हमारी कोशिश हमेशा 100% सटीक जानकारी देने की होती है। लेकिन इंसान होने के नाते गलतियां हो सकती हैं। हमारी 'सुधार नीति' (Corrections Policy) हमारी पारदर्शिता और जवाबदेही के प्रति हमारी प्रतिबद्धता को दर्शाती है।
                            </p>

                            {/* Section 1 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">1. गलतियों को स्वीकारना</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>अगर हमारी किसी खबर में तथ्यात्मक (Factual) गलती पाई जाती है, तो हम उसे छुपाने के बजाय तुरंत और स्पष्ट रूप से स्वीकार करते हैं।</p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <RefreshCcw size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">2. सुधार की प्रक्रिया</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>गलती का पता चलने पर, हम मूल लेख को अपडेट करते हैं और लेख के अंत या शुरुआत में एक "अपडेट" (Update) या "सुधार" (Correction) नोट जोड़ते हैं। यह नोट स्पष्ट करता है कि पहले क्या गलती थी और अब क्या सुधारा गया है।</p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">3. सोशल मीडिया पर सुधार</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>यदि गलत जानकारी सोशल मीडिया (फेसबुक, ट्विटर आदि) पर साझा की गई है, तो हम उस पोस्ट को डिलीट कर सकते हैं या उस पर सुधार वाला नया पोस्ट जारी कर सकते हैं ताकि गलत जानकारी फैलने से रोकी जा सके।</p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">4. पाठकों की भागीदारी</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>हम अपने पाठकों को प्रोत्साहित करते हैं कि यदि उन्हें हमारी किसी रिपोर्ट में कोई गलती दिखे, तो वे तुरंत हमें सूचित करें।</p>
                                    <p className="font-bold">गलती रिपोर्ट करने के लिए ईमेल करें: <span className="text-brand-red">editor@thinkindia.press</span></p>
                                </div>
                            </section>
                            
                        </div>

                        {/* Contact Block */}
                        <div className="mt-12 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <p className="text-sm text-news-muted font-bold">
                                यदि इस नीति को लेकर आपके कोई प्रश्न हैं, तो कृपया <a href="/contact" className="text-brand-red hover:underline">हमसे संपर्क करें</a>।
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
