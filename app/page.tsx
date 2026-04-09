import { client, urlFor } from '@/lib/sanity'
import { getAllNews, getNewsByCategory, getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import NewsGrid from '@/components/NewsGrid'
import BreakingNews from '@/components/BreakingNews'
import MailButton from '@/components/MailButton'
import PublicLayout from '@/components/PublicLayout'
import AdBanner from '@/components/AdBanner'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Globe } from 'lucide-react'
import { Metadata } from 'next'
import { scrubBrandNames, normalizeText, scrubSlug } from '@/lib/safety'

export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'NR Regional News Bureau | Global Reporting Standards',
  description: 'NR Regional News Bureau provides authoritative, real-time coverage of Jharkhand regional events with unparalleled integrity and precision.',
}

async function getHomepageData() {
  const [pgFeatured, pgGarhwa, pgPalamu, pgJobs, pgCrime] = await Promise.all([
    getAllNews(10),
    getNewsByCategory('स्थानीय समाचार', 10),
    getNewsByDistrict('palamu', 10),
    getNewsByCategory('सरकारी नौकरियां', 10),
    getNewsByCategory('अपराध', 10),
  ])

  const snFeatured = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...10] { _id, title, slug, excerpt, featureImage, publishedAt, author->{name} }`)
  const snGarhwa = await client.fetch(`*[_type == "article" && district == "garhwa"] | order(publishedAt desc)[0...15] { _id, title, slug, excerpt, featureImage, publishedAt, author->{name} }`)
  const snPalamu = await client.fetch(`*[_type == "article" && district == "palamu"] | order(publishedAt desc)[0...15] { _id, title, slug, excerpt, featureImage, publishedAt, author->{name} }`)
  const snJobs = await client.fetch(`*[_type == "article" && category->slug.current == "jobs"] | order(publishedAt desc)[0...15] { _id, title, slug, excerpt, featureImage, publishedAt }`)
  const snCrime = await client.fetch(`*[_type == "article" && category->slug.current == "crime"] | order(publishedAt desc)[0...15] { _id, title, slug, excerpt, featureImage, publishedAt }`)

  const finalData = {
    featured: mergeAndSortNews(pgFeatured, snFeatured, 8),
    garhwa: mergeAndSortNews(pgGarhwa, snGarhwa, 6),
    palamu: mergeAndSortNews(pgPalamu.articles || pgPalamu, snPalamu, 6),
    jobs: mergeAndSortNews(pgJobs, snJobs, 4),
    crime: mergeAndSortNews(pgCrime, snCrime, 4),
  }

  return finalData
}

export default async function Home() {
  const data = await getHomepageData()
  

  // Deduplicate across sections by ID and Normalized Title
  const shownIds = new Set<string>()
  const shownTitles = new Set<string>()

  const isDuplicate = (story: any) => {
    const id = story._id || story.id
    const normTitle = normalizeText(story.title)
    if (shownIds.has(id) || (normTitle && shownTitles.has(normTitle))) return true
    return false
  }

  const markAsShown = (story: any) => {
    shownIds.add(story._id || story.id)
    const normTitle = normalizeText(story.title)
    if (normTitle) shownTitles.add(normTitle)
  }

  // 1. Featured / Hero Section
  const heroStories: any[] = []
  const availableFeatured = data.featured || []
  for (const s of availableFeatured) {
    if (heroStories.length >= 2) break
    if (!isDuplicate(s)) {
      heroStories.push(s)
      markAsShown(s)
    }
  }
  
  const subStories: any[] = []
  for (const s of availableFeatured) {
    if (subStories.length >= 6) break
    if (!isDuplicate(s)) {
      subStories.push(s)
      markAsShown(s)
    }
  }
  
  // 2. Category Sections
  const filteredGarhwa = (data.garhwa || []).filter(s => !isDuplicate(s))
  const filteredPalamu = (data.palamu || []).filter(s => !isDuplicate(s))
  const filteredJobs = (data.jobs || []).filter(s => !isDuplicate(s))
  const filteredCrime = (data.crime || []).filter(s => !isDuplicate(s))

  return (
    <PublicLayout>
      
      <div className="bg-news-paper min-h-screen">
        <div className="container py-10 lg:py-16">
          
          {/* ALL NEWS CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 -mt-2 gap-4">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-navy/40">ताज़ा ब्रेकिंग न्यूज़</div>
            <Link href="/news" className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-gold transition-all shadow-md">
              सभी खबरें देखें <ArrowRight size={12} />
            </Link>
          </div>

          {/* DUAL HERO SECTION: Medium & Balanced */}
          {heroStories && heroStories.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 lg:mb-16">
              {heroStories.map((story: any, i: number) => {
                const imageUrl = story.image_url || (story.featureImage?.asset ? urlFor(story.featureImage).width(800).height(500).url() : null);
                
                return (
                  <section key={story._id || i} className="group relative rounded-3xl overflow-hidden bg-brand-navy shadow-2xl min-h-[380px] lg:min-h-[420px] flex flex-col border border-white/5">
                    {/* Visual Background */}
                    <div className="absolute inset-0 z-0">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={story.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
                      <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-transparent transition-colors duration-500" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 p-8 lg:p-10 flex flex-col justify-end h-full mt-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-brand-gold text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                            <ShieldCheck size={12} /> Bureau {i === 0 ? 'Primary' : 'Secondary'}
                        </span>
                      </div>
                      
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-serif leading-[1.1] mb-4 group-hover:text-brand-gold transition-colors duration-300">
                        {story.title}
                      </h2>
                      
                      <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium line-clamp-2 max-w-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        {story.excerpt}
                      </p>

                      <Link 
                        href={`/news/${typeof story.slug === 'string' ? story.slug : story.slug?.current}`}
                        className="inline-flex items-center gap-3 text-white font-black uppercase tracking-widest text-[10px] group/btn"
                      >
                        Examine Report <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          <div className="mb-12">
            <BreakingNews />
          </div>

          {/* SECONDARY STORIES: Grid of 3 */}
          {subStories && subStories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 -mt-8 lg:-mt-12 relative z-20 container">
                {subStories.map((story: any) => {
                    const imageUrl = story.image_url || (story.featureImage?.asset ? urlFor(story.featureImage).width(600).height(400).url() : null);
                    const date = story.publishedAt || story.published_at;
                    
                    return (
                        <Link 
                            key={story._id || story.id}
                            href={`/news/${typeof story.slug === 'string' ? story.slug : story.slug?.current}`}
                            className="group bg-white p-6 rounded-2xl shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col gap-4"
                        >
                            <div className="aspect-video rounded-xl overflow-hidden relative bg-slate-100">
                                {imageUrl ? (
                                    <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={story.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-navy/10">
                                        <Globe size={40} />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-brand-navy/80 backdrop-blur-md text-brand-gold text-[8px] font-black uppercase px-2 py-1 rounded">Bureau Dispatch</div>
                            </div>
                            <h3 className="text-xl font-black text-brand-navy font-serif leading-tight transition-colors line-clamp-2">
                                {story.title}
                            </h3>
                            <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-brand-navy/30">
                                <span>{date ? new Date(date).toLocaleDateString() : 'Recent'}</span>
                                <span>Analysis &rarr;</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
          )}

          <AdBanner slot="homepage_hero" width={728} height={90} hidePlaceholder={true} />

          {/* LATEST ARCHIVES SECTIONS */}
          <div className="space-y-24 mt-24">
            <NewsGrid 
              title="गढ़वा समाचार | Garhwa Reports" 
              articles={filteredGarhwa} 
              link="/garhwa" 
              limit={6} 
              moreText="Explore All Garhwa Reports"
            />
            
            {/* SPECIAL DIVIDER: Agency Trust */}
            <div className="bg-brand-navy rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Globe size={400} className="absolute -top-20 -right-20 text-white" />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="text-brand-gold font-black uppercase tracking-[0.4em] text-xs mb-6">NR Bureau Integrity</div>
                    <h2 className="text-3xl lg:text-5xl font-black text-white font-serif mb-8 leading-tight">
                        Authoritative Reporting for a Global Community.
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 font-medium">
                        Dedicated to uncompromised reporting, NR Regional News Bureau operates at the intersection of local expertise and international standards of integrity.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white">
                            <div className="text-brand-gold font-black text-2xl mb-1">5M+</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Monthly Readers</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white">
                            <div className="text-brand-gold font-black text-2xl mb-1">200+</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Field Agents</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white">
                            <div className="text-brand-gold font-black text-2xl mb-1">24/7</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">News Stream</div>
                        </div>
                    </div>
                </div>
            </div>

            <NewsGrid 
              title="पलामू समाचार | Palamu Reports" 
              articles={filteredPalamu} 
              link="/palamu" 
              limit={6} 
              moreText="View All Palamu Archives"
            />

            {/* JOBS HUB: Premium Style */}
            {filteredJobs && filteredJobs.length > 0 && (
              <section className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-black text-brand-navy font-serif mb-2 italic">Global Opportunities 🔥</h2>
                            <p className="text-gray-500 font-medium tracking-tight">Latest government & private sector openings monitored by NR Regional Bureau.</p>
                        </div>
                        <Link href="/category/jobs" className="bg-brand-navy text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors self-start shadow-lg">
                            Access Opportunity Hub
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredJobs.slice(0, 4).map((job: any) => (
                        <Link key={job._id || job.id} href={`/news/${job.slug.current || job.slug}`} className="group p-6 rounded-2xl bg-news-paper border border-transparent hover:border-brand-gold/30 hover:shadow-lg transition-all">
                            <h3 className="text-lg font-black text-brand-navy font-serif mb-3 line-clamp-2 leading-tight transition-colors italic">{job.title}</h3>
                            <div className="text-[10px] font-black tracking-widest text-brand-navy/30 uppercase">Open Tracking Center &rarr;</div>
                        </Link>
                    ))}
                    </div>
                </div>
              </section>
            )}

            <NewsGrid 
              title="अपराध समीक्षा | Crime Analysis" 
              articles={filteredCrime} 
              link="/category/crime" 
              limit={4} 
              moreText="Examine Full Crime Database"
            />
          </div>

          <AdBanner slot="homepage_middle" width={728} height={90} hidePlaceholder={true} />
          <MailButton />
        </div>
      </div>
    </PublicLayout>
  )
}
