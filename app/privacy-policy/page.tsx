import { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'
import { Eye, Lock, Database, Cookie, Scale, Server } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Privacy Policy | ThinkIndia.press',
    description: 'Comprehensive Privacy Policy and Data Governance Framework for ThinkIndia.press.',
}

export default function PrivacyPolicyPage() {
    return (
        <PublicLayout>
            <div className="container py-10 lg:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            Legal Governance & Compliance
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-news-text dark:text-white serif-font tracking-tight mb-4">
                            Privacy <span className="text-brand-red">Policy</span>
                        </h1>
                        <p className="text-news-muted text-sm lg:text-base font-bold tracking-widest uppercase mb-4">Data Protection Addendum</p>
                        <p className="text-news-muted text-sm max-w-2xl mx-auto">
                            Effective Date of Invocation: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-brand-navy p-8 lg:p-12 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium">
                        
                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                            
                            {/* Preamble */}
                            <p className="text-base text-news-text dark:text-gray-300 font-medium leading-relaxed border-l-4 border-brand-red pl-6 py-2 italic">
                                This monolithic privacy instrument ("Agreement" or "Framework") systematically demarcates the rigorous protocols, fiduciary methodologies, and cryptographic standards undertaken by ThinkIndia.press (hereinafter referred to as "the Enterprise", "We", "Us", or "Our") concerning the acquisition, syntactical processing, and obfuscation of personally identifiable information ("PII") and anonymized telemetry from constituents ("User", "You", or "Data Subject").
                            </p>

                            {/* Section 1 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Database size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">1. Empirical Data Acquisition & Telemetry</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>Upon your utilization of our digital infrastructure, we systematically harvest multifaceted data corpuses through automated reconnaissance paradigms. This entails, but is not unilaterally confined to:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Volumetric Identifying Information:</strong> Lexical strings, cryptographic identifiers, and electronic correspondence vectors supplied autonomously by the Data Subject during onboarding.</li>
                                        <li><strong>Asynchronous Telemetry:</strong> Geospatial coordinates, TCP/IP packet header metadata, algorithmic browser fingerprinting, and interactional heat-mapping across our proprietary node clusters.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Cookie size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">2. Cryptographic Session Tokens (Cookies)</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>Our platform operationalizes persistent and session-based alphanumeric micro-payloads ("Cookies") alongside web beacons to orchestrate seamless state management. The provisioning of these lexical artifacts is paramount for load balancing and granular psychographic profiling. Excision of these localized storage vectors via client-side heuristic blocking may precipitously degrade the ontological integrity of the user interface.</p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Lock size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">3. Infosec & Substantive Anonymization</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>We leverage asymmetric cryptographic schemas and enterprise-grade perimeter fortification to mitigate exogenous infiltration, cybernetic malevolence, and unwarranted exfiltration of proprietary data lakes. Nonetheless, due to the inherent entropy of decentralized digital networks, we unequivocally disclaim absolute fiduciary liability for zero-day exploits circumventing our infrastructural contingencies.</p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Server size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">4. Third-Party Syndication & Subprocessors</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>Pursuant to algorithmic optimization, your datasets may be algorithmically partitioned and synergistically transmitted to vetted third-party algorithmic subprocessors. These transnational entities are governed by auxiliary Data Processing Agreements (DPAs) functioning under disparate jurisdictional mandates. We relinquish all indemnification pertaining to peripheral data mishandling by sovereign third-party networks.</p>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                                        <Scale size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-news-text dark:text-white serif-font">5. Jurisdictional Mandates & Extraterritoriality</h2>
                                </div>
                                <div className="pl-14 text-news-muted text-base leading-relaxed space-y-4">
                                    <p>This governing document constitutes a legally binding concordat adjudicated under the prevailing statutory frameworks of the applicable jurisdiction, superseding any prior verbal or extraneous representations. Continued navigation within our digital ecosystem constitutes irrevocable, unmitigated capitulation to these stipulations.</p>
                                </div>
                            </section>
                            
                        </div>

                        {/* Contact Block */}
                        <div className="mt-12 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <p className="text-sm text-news-muted font-bold">
                                For formal requisitions concerning data sovereignty or GDPR/CCPA invocations, direct your correspondence to our <a href="/contact" className="text-brand-red hover:underline">Compliance Officers</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
