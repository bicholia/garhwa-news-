import { Metadata } from 'next'
import { Target, Globe, ShieldCheck, Award } from 'lucide-react'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
    title: 'हमारे बारे में | ThinkIndia.press',
    description: 'ThinkIndia.press (थिंक इंडिया) - झारखंड की नंबर 1 न्यूज़ ब्यूरो। हमारी टीम, मिशन और विजन के बारे में जानें।',
}

export default function AboutPage() {
    return (
        <PublicLayout>
            <div className="container py-10 lg:py-16">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            The News Revolution
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-news-text dark:text-white serif-font tracking-tight mb-6">
                            Breaking Barriers, <br />
                            <span className="text-brand-red">Defining Truth.</span>
                        </h1>
                        <p className="text-news-muted text-lg leading-relaxed">
                            ThinkIndia.press is Jharkhand's premier digital news bureau. We don't just report the news; we define the truth with integrity, speed, and uncompromising local intelligence.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white dark:bg-brand-navy p-8 lg:p-12 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium mb-12">
                        <div className="space-y-6 text-base text-news-text dark:text-gray-300 leading-relaxed font-medium">
                            <p>
                                ThinkIndia.press (थिंक इंडिया) की स्थापना एक स्पष्ट और निडर विजन के साथ की गई थी— झारखंड और देश के दूर-दराज के इलाकों से उठने वाली उस आवाज़ को मुख्यधारा तक पहुँचाना जिसे अक्सर नज़रअंदाज़ कर दिया जाता है। हमने महसूस किया कि पारंपरिक मीडिया की चकाचौंध में ज़मीनी हकीकत और आम आदमी के वास्तविक मुद्दे कहीं दब से गए हैं।
                            </p>
                            <p>
                                आज, हम सिर्फ एक न्यूज़ पोर्टल नहीं, बल्कि एक <strong>विचारधारा (Ideology)</strong> हैं। हम डिजिटल पत्रकारिता के उस नए युग का नेतृत्व कर रहे हैं जहां गति (Speed) के साथ-साथ सत्यता (Accuracy) का भी सर्वोच्च ध्यान रखा जाता है। हमारी टीम दिन-रात एक करके उन कहानियों को सामने लाती है जो समाज में वास्तविक बदलाव (Real Change) लाने की क्षमता रखती हैं।
                            </p>
                            <p>
                                हमारा लक्ष्य है: सत्ता से सवाल पूछना, शोषितों को मंच देना, और एक पारदर्शी समाज के निर्माण में एक 'स्वतंत्र मीडिया' की सच्ची भूमिका निभाना।
                            </p>
                        </div>
                    </div>

                    {/* Grid Section */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="bg-white dark:bg-brand-navy p-8 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-card flex flex-col gap-4">
                            <Target className="text-brand-red" size={36} strokeWidth={1.5} />
                            <h3 className="text-xl font-bold text-news-text dark:text-white">हमारा मिशन</h3>
                            <p className="text-sm text-news-muted leading-relaxed">सटीक, निष्पक्ष और गहन शोध पर आधारित समाचारों को हर स्मार्टफोन तक सबसे पहले पहुँचाना।</p>
                        </div>
                        <div className="bg-brand-red p-8 rounded-[24px] text-white shadow-card flex flex-col gap-4">
                            <Globe size={36} strokeWidth={1.5} />
                            <h3 className="text-xl font-bold">हमारा विजन</h3>
                            <p className="text-red-100 text-sm leading-relaxed">झारखंड का सबसे भरोसेमंद, प्रभावशाली और अत्याधुनिक न्यूज़ नेटवर्क बनना, जिसे राष्ट्रीय स्तर पर पहचान मिले।</p>
                        </div>
                        <div className="bg-ndtv-black p-8 rounded-[24px] text-white shadow-card flex flex-col gap-4">
                            <ShieldCheck className="text-brand-red" size={36} strokeWidth={1.5} />
                            <h3 className="text-xl font-bold">सत्यता</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">हर खबर की कई स्तरों पर (Multi-layer) जांच और तथ्यों का सख्त मिलान ताकि फेक न्यूज़ से लड़ा जा सके।</p>
                        </div>
                        <div className="bg-white dark:bg-brand-navy p-8 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-card flex flex-col gap-4">
                            <Award className="text-brand-red" size={36} strokeWidth={1.5} />
                            <h3 className="text-xl font-bold text-news-text dark:text-white">सम्मान</h3>
                            <p className="text-sm text-news-muted leading-relaxed">पत्रकारिता के उच्चतम नैतिक मानकों का पालन करते हुए मानवीय गरिमा और निजता का पूर्ण सम्मान।</p>
                        </div>
                    </div>

                    {/* Leadership */}
                    <div className="bg-white dark:bg-[#121212] p-10 lg:p-14 rounded-[32px] border border-gray-100 dark:border-white/5 text-center shadow-premium relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-red" />
                        <div className="w-24 h-24 bg-brand-red/10 rounded-full flex items-center justify-center text-3xl font-black text-brand-red mx-auto mb-6">
                            S
                        </div>
                        <h3 className="text-3xl font-black text-news-text dark:text-white mb-2 serif-font">सुहासिनी शर्मा</h3>
                        <p className="text-brand-red text-xs font-black uppercase tracking-widest mb-6">Editor-in-Chief & Director</p>
                        <p className="text-news-muted font-medium leading-relaxed max-w-2xl mx-auto">
                            सुहासिनी शर्मा के कुशल नेतृत्व और बेबाक दृष्टिकोण ने 'थिंक इंडिया' को एक नई दिशा दी है। उनकी दूरदृष्टि है कि पत्रकारिता को केवल सूचना तंत्र तक सीमित न रखकर इसे सामाजिक जागरूकता का एक सशक्त हथियार बनाया जाए। उनके मार्गदर्शन में यह ब्यूरो नए कीर्तिमान स्थापित कर रहा है।
                        </p>
                    </div>

                </div>
            </div>
        </PublicLayout>
    )
}


