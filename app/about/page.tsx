import { Metadata } from 'next'
import { MapPin, Globe, ShieldCheck, Target, Users, Award, Heart, Camera } from 'lucide-react'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
    title: 'हमारे बारे में | ThinkIndia.press',
    description: 'ThinkIndia.press (थिंक इंडिया) - झारखंड की नंबर 1 न्यूज़ ब्यूरो। हमारी टीम, मिशन और विजन के बारे में जानें।',
}

export default function AboutPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-white dark:bg-black">
                {/* PREMIUM HERO SECTION */}
                <div className="relative h-[60vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
                    <img 
                        src="/about_hero_bg_1778925406510.png" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40" 
                        alt="Think India Newsroom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white dark:to-black" />
                    
                    <div className="container relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/20 backdrop-blur-md border border-brand-red/30 text-brand-red text-xs font-black uppercase tracking-[0.3em] mb-8 animate-fade-in">
                            The News Revolution
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tighter serif-font mb-6 drop-shadow-2xl">
                            Empowering <br />
                            <span className="text-brand-red">The Digital Voice</span>
                        </h1>
                        <p className="text-gray-300 text-lg lg:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
                            ThinkIndia.press is Jharkhand's premier digital news bureau, delivering integrity, speed, and local intelligence.
                        </p>
                    </div>
                </div>

                <div className="container py-12">
                    {/* VISION & IMPACT */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-1.5 bg-brand-red rounded-full" />
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Our Legacy</span>
                            </div>
                            <h2 className="text-2xl lg:text-4xl font-black text-black dark:text-white leading-[1.1] mb-10 serif-font uppercase tracking-tighter">
                                Breaking Barriers, <br />
                                <span className="text-brand-red">Defining Truth.</span>
                            </h2>
                            <div className="space-y-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                <p>
                                    ThinkIndia.press की शुरुआत एक बड़े विजन के साथ हुई थी — झारखंड के हर कोने की आवाज़ को दुनिया तक पहुँचाना। हमने देखा कि स्थानीय क्षेत्रों की गंभीर समस्याएँ और अनसुनी कहानियाँ बड़े मीडिया हाउसों की चकाचौंध में अक्सर गुम हो जाती थीं।
                                </p>
                                <p>
                                    आज, हम गर्व से झारखंड के पहले डिजिटल न्यूज़ नेटवर्क के रूप में खड़े हैं। हमारा उद्देश्य केवल सूचना देना नहीं, बल्कि ज़मीनी हकीकत को सामने लाना और **निडर पत्रकारिता (Fearless Journalism)** का एक नया मानक स्थापित करना है।
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col gap-6 transform hover:-translate-y-2 transition-all">
                                <Target className="text-brand-red" size={48} strokeWidth={1.5} />
                                <h3 className="text-xl font-bold text-black dark:text-white">हमारा मिशन</h3>
                                <p className="text-sm text-gray-500">सटीक और निष्पक्ष समाचार हर गाँव तक पहुँचाना।</p>
                            </div>
                            <div className="bg-brand-red p-10 rounded-3xl text-white flex flex-col gap-6 transform hover:-translate-y-2 transition-all mt-12">
                                <Globe size={48} strokeWidth={1.5} />
                                <h3 className="text-xl font-bold">हमारा विजन</h3>
                                <p className="text-red-100/80 text-sm">झारखंड का सबसे भरोसेमंद न्यूज़ नेटवर्क बनना।</p>
                            </div>
                            <div className="bg-gray-900 p-10 rounded-3xl text-white flex flex-col gap-6 transform hover:-translate-y-2 transition-all">
                                <ShieldCheck className="text-brand-red" size={48} strokeWidth={1.5} />
                                <h3 className="text-xl font-bold">सत्यता</h3>
                                <p className="text-gray-400 text-sm">हर खबर की गहन जाँच और तथ्यों का मिलान।</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col gap-6 transform hover:-translate-y-2 transition-all mt-12">
                                <Award className="text-brand-red" size={48} strokeWidth={1.5} />
                                <h3 className="text-xl font-bold">सम्मान</h3>
                                <p className="text-sm text-gray-500">पत्रकारिता के उच्चतम मानकों का पालन।</p>
                            </div>
                        </div>
                    </div>

                    {/* LEADERSHIP TEAM - SUHASINI SHARMA */}
                    <div className="mb-16">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white uppercase tracking-tight serif-font">
                                Leading The <span className="text-brand-red">Change</span>
                            </h2>
                            <p className="text-gray-500 mt-4 uppercase tracking-[0.2em] font-bold text-sm">The Mind Behind Think India Bureau</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="group bg-white dark:bg-white/5 p-12 rounded-[48px] border border-gray-100 dark:border-white/5 text-center hover:shadow-2xl transition-all duration-500">
                                <div className="w-32 h-32 bg-brand-red/10 rounded-full flex items-center justify-center text-4xl font-black text-brand-red mx-auto mb-8 group-hover:bg-brand-red group-hover:text-white transition-all duration-500">
                                    S
                                </div>
                                <h3 className="text-3xl font-black text-black dark:text-white mb-3 serif-font">सुहासिनी शर्मा</h3>
                                <p className="text-brand-red text-sm font-black uppercase tracking-[0.3em]">Editor-in-Chief & Director</p>
                                <div className="mt-8 flex justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10" />
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CORE VALUES - PREMIUM STRIPE */}
                    <div className="relative rounded-[40px] overflow-hidden bg-ndtv-black py-20 px-10 text-center border border-white/10">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <Camera className="absolute -top-10 -left-10 w-64 h-64 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-16 serif-font">
                            Our Core <span className="text-brand-red">Excellence</span>
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { title: 'Authenticity', desc: 'Verified by ground agents' },
                                { title: 'Impartiality', desc: 'No political bias' },
                                { title: 'Velocity', desc: 'Fastest reporting grid' },
                                { title: 'Impact', desc: 'Driving real change' }
                            ].map((v, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="text-4xl font-black text-white/10">0{i+1}</div>
                                    <h4 className="text-xl font-bold text-white uppercase tracking-tighter">{v.title}</h4>
                                    <p className="text-gray-500 text-sm">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 text-center border-t border-gray-100 dark:border-white/5 pt-12">
                        <div>
                            <div className="text-3xl lg:text-5xl font-black text-black dark:text-white mb-2">5 Crore+</div>
                            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Monthly Readers</p>
                        </div>
                        <div>
                            <div className="text-3xl lg:text-5xl font-black text-black dark:text-white mb-2">3-Tier</div>
                            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">State • National • International</p>
                        </div>
                        <div>
                            <div className="text-3xl lg:text-5xl font-black text-black dark:text-white mb-2">24/7</div>
                            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Live News Grid</p>
                        </div>
                        <div>
                            <div className="text-3xl lg:text-5xl font-black text-black dark:text-white mb-2">100%</div>
                            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Authentic News</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}

