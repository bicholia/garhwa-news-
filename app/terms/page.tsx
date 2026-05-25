import { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'
import { Scale, FileText, ShieldAlert, BadgeInfo } from 'lucide-react'

export const metadata: Metadata = {
    title: 'सेवा की शर्तें (Terms of Service) | ThinkIndia.press',
    description: 'ThinkIndia.press का उपयोग करने के लिए नियम और शर्तें (Terms of Service)।',
}

export default function TermsPage() {
    return (
        <PublicLayout>
            <div className="container py-10 lg:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            Legal Policy
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-news-text dark:text-white serif-font tracking-tight mb-4">
                            सेवा की <span className="text-brand-red">शर्तें</span>
                        </h1>
                        <p className="text-news-muted text-sm lg:text-base font-bold tracking-widest uppercase mb-4">Terms of Service</p>
                        <p className="text-news-muted text-sm max-w-2xl mx-auto">
                            अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-brand-navy p-8 lg:p-12 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium">
                        
                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                            
                            {/* Section 1 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Scale size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">1. शर्तों की स्वीकृति</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>ThinkIndia.press ("वेबसाइट") पर आने और इसका उपयोग करने के लिए धन्यवाद। इस वेबसाइट का उपयोग करके, आप इन नियमों और शर्तों (Terms of Service) से बंधे होने के लिए सहमत हैं। यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।</p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">2. बौद्धिक संपदा अधिकार (Intellectual Property)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>इस वेबसाइट पर मौजूद सभी सामग्री, जिसमें लेख, समाचार, चित्र, वीडियो, लोगो, और ग्राफिक्स शामिल हैं, ThinkIndia.press या इसके लाइसेंसकर्ताओं की संपत्ति है।</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>आप व्यक्तिगत और गैर-व्यावसायिक उपयोग के लिए सामग्री पढ़ और साझा कर सकते हैं।</li>
                                        <li>हमारी स्पष्ट लिखित अनुमति के बिना हमारी सामग्री का किसी भी रूप में प्रकाशन, वितरण, या व्यावसायिक उपयोग सख्त वर्जित है।</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">3. उपयोगकर्ता का आचरण (User Conduct)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>वेबसाइट का उपयोग करते समय आप सहमत हैं कि आप:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>किसी भी गैर-कानूनी, भ्रामक, या हानिकारक गतिविधि में शामिल नहीं होंगे।</li>
                                        <li>टिप्पणियों (Comments) या मंचों पर अभद्र भाषा, घृणास्पद भाषण, या किसी व्यक्ति/समुदाय को ठेस पहुंचाने वाली सामग्री पोस्ट नहीं करेंगे।</li>
                                        <li>वेबसाइट के सर्वर या सुरक्षा को नुकसान पहुंचाने या हैक करने का प्रयास नहीं करेंगे।</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <BadgeInfo size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">4. अस्वीकरण (Disclaimer)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>हम सटीक और अद्यतित (up-to-date) समाचार प्रदान करने का पूरा प्रयास करते हैं, लेकिन:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>वेबसाइट पर मौजूद सामग्री केवल सामान्य जानकारी के लिए है। हम इसकी पूर्ण सटीकता, पूर्णता, या विश्वसनीयता की कोई कानूनी गारंटी नहीं देते हैं।</li>
                                        <li>किसी भी निर्णय को लेने से पहले संबंधित स्रोतों से जानकारी की पुष्टि स्वयं कर लें।</li>
                                        <li>इस वेबसाइट पर उपलब्ध तीसरे पक्ष (Third-party) के लिंक या विज्ञापनों की सामग्री के लिए ThinkIndia.press ज़िम्मेदार नहीं है।</li>
                                    </ul>
                                </div>
                            </section>
                            
                        </div>

                        {/* Contact Block */}
                        <div className="mt-12 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <p className="text-sm text-news-muted font-bold">
                                यदि इन शर्तों को लेकर आपके कोई प्रश्न हैं, तो कृपया <a href="/contact" className="text-brand-red hover:underline">हमसे संपर्क करें</a>।
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
