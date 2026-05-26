import { client, urlFor } from '@/lib/sanity'
import { getAllNews, getNewsByCategory, getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import NewsGrid from '@/components/NewsGrid'
import NDTVHero from '@/components/NDTVHero'
import BreakingNews from '@/components/BreakingNews'
import PhotoGallery from '@/components/PhotoGallery'
import PublicLayout from '@/components/PublicLayout'
import AdBanner from '@/components/AdBanner'
import NewsStripe from '@/components/NewsStripe'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Globe, PlayCircle, TrendingUp, MessageCircle, Send, Instagram } from 'lucide-react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { normalizeText } from '@/lib/safety'

export const revalidate = 60 // Revalidate every minute

export const metadata: Metadata = {
  title: 'ThinkIndia News | गढ़वा, पलामू और झारखंड की नंबर 1 ताज़ा ख़बरें',
  description: 'ThinkIndia News (थिंक इंडिया) प्रदान करता है सबसे तेज़ हिंदी समाचार। गढ़वा, पलामू और झारखंड की ताज़ा खबरें, ब्रेकिंग न्यूज़, राजनीति और अपराध की विस्तृत रिपोर्ट्स।',
  keywords: [
    'ThinkIndia News', 'ThinkIndia News Hindi', 'Garhwa News', 'Palamu News', 'Jharkhand News',
    'Hindi News Jharkhand', 'गढ़वा न्यूज़', 'पलामू न्यूज़', 'झारखंड समाचार', 'ताज़ा खबरें',
    'Breaking News Garhwa', 'Latest News Jharkhand', 'ThinkIndia.press'
  ],
  alternates: {
    canonical: 'https://thinkindia.press'
  }
}

async function getHomepageData() {
  // Max Density Fetching (NDTV Style)
  const [
    pgFeatured, 
    pgGarhwa, 
    pgPalamu, 
    pgCrime, 
    pgPolitics, 
    pgSports, 
    pgEducation,
    pgLatehar,
    pgChatra,
    pgIndia
  ] = await Promise.all([
    getAllNews(30),
    getNewsByDistrict('garhwa', 15),
    getNewsByDistrict('palamu', 15),
    getNewsByCategory('अपराध', 12),
    getNewsByCategory('राजनीति', 12),
    getNewsByCategory('खेल', 12),
    getNewsByCategory('शिक्षा', 12),
    getNewsByDistrict('latehar', 6),
    getNewsByDistrict('chatra', 6),
    getNewsByDistrict('india', 15),
  ])

  const snFeatured = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...60] { _id, title, "slug": slug.current, excerpt, featureImage, publishedAt, author->{name} }`)
  const snAstrology = await client.fetch(`*[_type == "article" && category->slug.current == "astrology"] | order(publishedAt desc)[0...3] { _id, title, "slug": slug.current, excerpt, featureImage, publishedAt, author->{name} }`)
  const snLove = await client.fetch(`*[_type == "article" && category->slug.current == "love-relationships"] | order(publishedAt desc)[0...3] { _id, title, "slug": slug.current, excerpt, featureImage, publishedAt, author->{name} }`)

  return {
    featured: mergeAndSortNews(pgFeatured, snFeatured, 30),
    garhwa: mergeAndSortNews(pgGarhwa.articles || pgGarhwa, [], 10),
    palamu: mergeAndSortNews(pgPalamu.articles || pgPalamu, [], 10),
    crime: mergeAndSortNews(pgCrime, [], 10),
    politics: mergeAndSortNews(pgPolitics, [], 8),
    sports: mergeAndSortNews(pgSports, [], 8),
    education: mergeAndSortNews(pgEducation, [], 8),
    latehar: pgLatehar.articles || pgLatehar,
    chatra: pgChatra.articles || pgChatra,
    india: mergeAndSortNews(pgIndia.articles || pgIndia, [], 10),
    astrology: snAstrology || [],
    loveRelationships: snLove || [],
  }
}

export default async function Home() {
  const data = await getHomepageData()
  
  const shownIds = new Set<string>()
  const shownTitles = new Set<string>()

  const isDuplicate = (story: any) => {
    if (!story) return true
    // Ensure only stories with images are shown on the homepage
    if (!story.featureImage && !story.image_url) return true
    
    const id = story._id || story.id
    const normTitle = normalizeText(story.title)
    if (shownIds.has(id) || (normTitle && shownTitles.has(normTitle))) return true
    return false
  }

  const markAsShown = (story: any) => {
    if (!story) return
    shownIds.add(story._id || story.id)
    const normTitle = normalizeText(story.title)
    if (normTitle) shownTitles.add(normTitle)
  }

  const allFeatured = data.featured || []
  
  // 1. Hero Setup
  let mainStory = allFeatured.find(s => s && s.slug && s.slug.toLowerCase().includes('sneha') && !isDuplicate(s));
  
  if (!mainStory) {
    mainStory = allFeatured.find(s => !isDuplicate(s));
  }

  if (mainStory) markAsShown(mainStory)

  const topStories: any[] = []
  for (const s of allFeatured) {
    if (topStories.length >= 6) break
    if (!isDuplicate(s)) {
      topStories.push(s)
      markAsShown(s)
    }
  }

  const trendingStories: any[] = []
  for (const s of allFeatured) {
    if (trendingStories.length >= 6) break
    if (!isDuplicate(s)) {
      trendingStories.push(s)
      markAsShown(s)
    }
  }

  // 2. Sections Filtering
  const filterNews = (news: any[], limit: number) => {
    const res: any[] = []
    for (const s of (news || [])) {
      if (res.length >= limit) break
      if (!isDuplicate(s)) {
        res.push(s)
        markAsShown(s)
      }
    }
    return res
  }

  const fGarhwa = filterNews(data.garhwa, 10)
  const fPalamu = filterNews(data.palamu, 10)
  const fIndia = filterNews(data.india, 10)
  const fPolitics = filterNews(data.politics, 8)
  const fCrime = filterNews(data.crime, 8)
  const fSports = filterNews(data.sports, 8)
  const fEducation = filterNews(data.education, 8)

  // 3. Ad Replacement News (High Density)
  const adTopNews = filterNews(allFeatured, 4)
  const adIndiaNews = filterNews(allFeatured, 3)
  const adGarhwaNews = filterNews(allFeatured, 3)
  const adSecondaryNews = filterNews(allFeatured, 3)
  const adSidebarNews = filterNews(allFeatured, 5)

  // Filter gallery stories to ensure they have valid images
  const galleryStories = allFeatured
    .filter(s => s && (s.image_url || s.featureImage))
    .slice(0, 5)

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "ThinkIndia News",
    "alternateName": "ThinkIndia News",
    "url": "https://thinkindia.press",
    "logo": "https://thinkindia.press/logo-think-india.png",
    "foundingLocation": {
      "@type": "Place",
      "name": "Garhwa, Jharkhand, India"
    },
    "knowsAbout": ["Jharkhand News", "Garhwa News", "Palamu News", "Hindi News"]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ThinkIndia News",
    "url": "https://thinkindia.press",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thinkindia.press/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <div className="min-h-screen">
        {/* TIER 0: LEADERBOARD */}
        <div className="bg-white border-b border-gray-100 py-2 hidden lg:flex justify-center items-center">
            <AdBanner slot="top_max_leaderboard" width={970} height={90} className="w-full max-w-[970px] px-4 my-1" hidePlaceholder={true} />
        </div>

        {/* TIER 1: BREAKING TICKER (Edge to Edge) */}
        <Suspense fallback={<div className="h-12 bg-gray-50 animate-pulse rounded" />}>
          <BreakingNews />
        </Suspense>

        {/* TIER 1.5: TRENDING SWIPE (After Bureau Alert) - HIDDEN ON MOBILE HERE */}
        <div className="container mt-4 lg:mt-6 hidden lg:block">
            <NewsStripe articles={adTopNews} title="Trending Now" />
        </div>

        <div className="container py-2 lg:py-6">
          
          <NDTVHero 
            mainStory={mainStory} 
            topStories={topStories} 
            trendingStories={trendingStories} 
          />

          {/* MOBILE ONLY TRENDING (Moved from top) */}
          <div className="lg:hidden mb-6">
              <NewsStripe articles={adTopNews} title="Trending Now" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
            {/* MAIN FEED (LHS) */}
            <div className="lg:col-span-8 xl:col-span-9">
              
              {/* NATIONAL SECTION */}
              <NewsGrid title="Local & National News" articles={fIndia} variant="mixed" link="/india" />

              {/* BIG STORY GRID: GARHWA */}
              <NewsGrid title="Local News: Garhwa" articles={fGarhwa} variant="standard" limit={8} link="/garhwa" />

              {/* DENSE GRID: PALAMU */}
              <NewsGrid title="Local News: Palamu" articles={fPalamu} variant="standard" limit={8} link="/palamu" />

              {/* PHOTO GALLERY HOOK */}
              <div className="my-12 lg:my-20">
                <PhotoGallery articles={galleryStories} />
              </div>

              {/* POLITICS & CRIME (DENSE LISTS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                 <NewsGrid title="Local Politics" articles={fPolitics} variant="list" link="/category/politics" />
                 <NewsGrid title="Local Crime News" articles={fCrime} variant="list" link="/category/crime" />
              </div>

              <div className="my-10 lg:my-16">
                <AdBanner slot="mid_home_2" width={728} height={90}>
                    <NewsStripe articles={adSecondaryNews} title="National Briefing" />
                </AdBanner>
              </div>

              {/* SECONDARY CATEGORIES */}
              <NewsGrid title="Local Education News" articles={fEducation} variant="standard" limit={4} link="/category/education" />
              <NewsGrid title="Local Sports Arena" articles={fSports} variant="mixed" limit={6} link="/category/sports" />

            </div>

            {/* SIDEBAR (RHS) */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
              {/* TOP PORTION: SCROLLABLE */}
              <div className="space-y-8">
                  <AdBanner slot="sidebar_skyscraper" width={300} height={600}>
                      <NewsStripe articles={adSidebarNews} title="Live Wire" variant="vertical" />
                  </AdBanner>
                  
                  {/* Sidebar Most Read */}
                  <div className="bg-brand-navy p-6 rounded-[24px] text-white shadow-2xl relative overflow-hidden">
                    <Globe className="absolute -bottom-6 -right-6 text-white/5" size={100} />
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold mb-5 flex items-center gap-2">
                        <TrendingUp size={14} /> Bureau Intel
                    </h3>
                    <div className="space-y-4 relative z-10">
                        {allFeatured.slice(20, 25).map((article: any, i: number) => (
                          <Link key={i} href={`/news/${article.slug}`} className="group block border-b border-white/5 pb-3 last:border-0">
                            <div className="flex flex-col flex-1">
                              <div className='min-h-[36px] lg:min-h-[40px]'>
                                <h4 className='font-bold text-gray-100 leading-snug group-hover:text-brand-gold transition-all duration-300 serif-font text-[12px] lg:text-[14px] line-clamp-2'>
                                    {article.title}
                                </h4>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
              </div>

              {/* BOTTOM PORTION: STICKY WHEN SCROLLING */}
              <div className="sticky top-24 space-y-8">
                  {/* Astrology Widget */}
                  {data.astrology && data.astrology.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#1E1B1B] dark:to-[#1a1310] p-6 rounded-[24px] border border-orange-100 dark:border-orange-950/30 shadow-card">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400 mb-5 flex items-center gap-2">
                        🌟 दैनिक राशिफल (Horoscope)
                      </h3>
                      <div className="space-y-4">
                        {data.astrology.map((article: any, i: number) => (
                          <Link key={i} href={`/news/${article.slug}`} className="group block border-b border-orange-100/50 dark:border-orange-950/20 pb-3 last:border-0">
                            <h4 className="font-bold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-amber-600 transition-colors serif-font text-[13px] line-clamp-2">
                              {article.title}
                            </h4>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Relationships Widget */}
                  {data.loveRelationships && data.loveRelationships.length > 0 && (
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-[#21161B] dark:to-[#1B1115] p-6 rounded-[24px] border border-rose-100 dark:border-rose-950/30 shadow-card">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 dark:text-rose-400 mb-5 flex items-center gap-2">
                        ❤️ प्रेम और रिश्ते (Relationships)
                      </h3>
                      <div className="space-y-4">
                        {data.loveRelationships.map((article: any, i: number) => (
                          <Link key={i} href={`/news/${article.slug}`} className="group block border-b border-rose-100/50 dark:border-rose-950/20 pb-3 last:border-0">
                            <h4 className="font-bold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-rose-600 transition-colors serif-font text-[13px] line-clamp-2">
                              {article.title}
                            </h4>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Latest News Sidebar Widget */}
                  <div className="bg-white/85 dark:bg-[#0B1120]/80 backdrop-blur-xl p-6 rounded-[24px] border border-gray-200/50 dark:border-white/10 shadow-premium relative overflow-hidden">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-5 flex items-center gap-2">
                      ⚡ मुख्य समाचार (Latest News)
                    </h3>
                    <div className="space-y-4">
                      {allFeatured.slice(25, 29).map((article: any, i: number) => (
                        <Link key={i} href={`/news/${article.slug}`} className="group block border-b border-gray-100 dark:border-white/5 pb-3 last:border-0">
                          <h4 className="font-bold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-brand-red transition-colors serif-font text-[13px] line-clamp-2">
                            {article.title}
                          </h4>
                        </Link>
                      ))}
                    </div>
                  </div>
              </div>
            </aside>
          </div>
        </div>


      </div>
    </PublicLayout>
  )
}
