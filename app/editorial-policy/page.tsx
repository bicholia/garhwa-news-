import { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'
import { Search, PenTool, Scale, CheckCircle2, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
    title: 'संपादकीय नीति (Editorial Policy) | ThinkIndia.press',
    description: 'ThinkIndia.press की संपादकीय नीति। हमारे समाचार रिपोर्टिंग के मानक और सिद्धांत।',
}

export default function EditorialPolicyPage() {
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
                            संपादकीय <span className="text-brand-red">नीति</span>
                        </h1>
                        <p className="text-news-muted text-sm lg:text-base font-bold tracking-widest uppercase mb-4">Editorial Policy</p>
                        <p className="text-news-muted text-sm max-w-2xl mx-auto">
                            अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-brand-navy p-8 lg:p-12 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium">
                        
                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                            
                            {/* Intro */}
                            <p className="text-lg text-news-text dark:text-gray-300 font-medium leading-relaxed border-l-4 border-brand-red pl-6 py-2">
                                ThinkIndia.press (थिंक इंडिया) में हम निष्पक्ष, सटीक और जवाबदेह पत्रकारिता के लिए प्रतिबद्ध हैं। हमारी संपादकीय नीति (Editorial Policy) यह सुनिश्चित करती है कि हम अपने पाठकों तक हमेशा सत्य और तथ्य-आधारित समाचार पहुंचाएं।
                            </p>

                            {/* Section 1 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">1. सटीकता (Accuracy)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>सच्चाई हमारा सर्वोच्च प्राथमिक सिद्धांत है। हम किसी भी खबर को प्रकाशित करने से पहले उसके तथ्यों (Facts) की कठोरता से जांच करते हैं। अफवाहों और फेक न्यूज़ (Fake News) के लिए हमारे प्लेटफॉर्म पर कोई जगह পণ্ডিত नहीं है।</p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Scale size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">2. निष्पक्षता और संतुलन (Impartiality and Balance)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>हमारी रिपोर्टिंग किसी भी राजनीतिक दल, कॉर्पोरेट या विशेष समूह के प्रभाव से मुक्त है। किसी भी विवादित मुद्दे पर हम सभी पक्षों की राय (Version) को समान स्थान देते हैं, ताकि पाठक स्वयं अपना दृष्टिकोण तय कर सकें।</p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Search size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">3. स्रोतों की सुरक्षा (Protection of Sources)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>पत्रकारिता के नैतिक मानकों का पालन करते हुए, हम उन स्रोतों (Sources) की पहचान हमेशा गुप्त रखते हैं जो हमें संवेदनशील या भ्रष्ट आचरण से जुड़ी जानकारी प्रदान करते हैं।</p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">4. संवेदनशीलता (Sensitivity)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>अपराध, दुर्घटना या किसी त्रासदी की रिपोर्टिंग करते समय हम पीड़ित की गरिमा और निजता का पूरा ध्यान रखते हैं। हम विचलित करने वाली (Disturbing) तस्वीरों या भाषा के उपयोग से बचते हैं।</p>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <PenTool size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">5. विज्ञापन और संपादकीय में अंतर</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>हमारे विज्ञापनों (Advertisements) और समाचारों के बीच एक स्पष्ट रेखा है। कोई भी प्रायोजित सामग्री (Sponsored Content) स्पष्ट रूप से "विज्ञापन" के रूप में चिह्नित की जाती है, ताकि पाठकों को भ्रम न हो।</p>
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
