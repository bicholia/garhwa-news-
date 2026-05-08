import { client, urlFor } from '@/lib/sanity'
import { getAllNews, getNewsByCategory, getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import NewsGrid from '@/components/NewsGrid'
import NDTVHero from '@/components/NDTVHero'
import BreakingNews from '@/components/BreakingNews'
import CityGrid from '@/components/CityGrid'
import PhotoGallery from '@/components/PhotoGallery'
import PublicLayout from '@/components/PublicLayout'
import AdBanner from '@/components/AdBanner'
import NewsStripe from '@/components/NewsStripe'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Globe, PlayCircle, TrendingUp } from 'lucide-react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { normalizeText } from '@/lib/safety'

export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'ThinkIndia News | गढ़वा और झारखंड की नंबर 1 ताज़ा ख़बरें',
  description: 'ThinkIndia News: गढ़वा, पलामू और झारखंड की सबसे तेज़ और विश्वसनीय न्यूज़। ब्रेकिंग न्यूज़, अपराध, और राजनीति की ताज़ा खबरें हिंदी में।',
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
  }
}

export default async function Home() {
  const data = await getHomepageData()
  
  const shownIds = new Set<string>()
  const shownTitles = new Set<string>()

  const isDuplicate = (story: any) => {
    if (!story) return true
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
  const mainStory = allFeatured.find(s => !isDuplicate(s))
  if (mainStory) markAsShown(mainStory)

  const topStories: any[] = []
  for (const s of allFeatured) {
    if (topStories.length >= 15) break
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

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <div className="bg-white min-h-screen">
        {/* TIER 0: LEADERBOARD */}
        <div className="bg-white border-b border-gray-100 py-3 hidden lg:flex justify-center flex-col items-center">
            <AdBanner slot="top_max_leaderboard" width={970} height={90}>
                <div className="container">
                    <NewsStripe articles={adTopNews} title="Trending Now" />
                </div>
            </AdBanner>
        </div>

        {/* TIER 1: BREAKING TICKER (Edge to Edge) */}
        <Suspense fallback={<div className="h-12 bg-gray-50 animate-pulse rounded" />}>
          <BreakingNews />
        </Suspense>

        <div className="container py-8">
          
          {/* TIER 2: NDTV PACKED HERO */}
          <NDTVHero 
            mainStory={mainStory} 
            topStories={topStories} 
            trendingStories={trendingStories} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* MAIN FEED (LHS) */}
            <div className="lg:col-span-9">
              
              {/* NATIONAL SECTION */}
              <NewsGrid title="National Highlights" articles={fIndia} variant="mixed" link="/india" />

              <div className="my-4 md:my-8">
                <AdBanner slot="mid_home_india" width={728} height={90}>
                    <NewsStripe articles={adIndiaNews} title="National News Feed" />
                </AdBanner>
              </div>

              {/* BIG STORY GRID: GARHWA */}
              <NewsGrid title="Garhwa Reports" articles={fGarhwa} variant="standard" link="/garhwa" />

              <div className="my-4 md:my-8">
                <AdBanner slot="mid_home_1" width={728} height={90}>
                    <NewsStripe articles={adGarhwaNews} title="Garhwa Fast Track" />
                </AdBanner>
              </div>

              {/* DENSE GRID: PALAMU */}
              <NewsGrid title="Palamu Reports" articles={fPalamu} variant="standard" link="/palamu" />

              {/* PHOTO GALLERY HOOK */}
              <PhotoGallery articles={allFeatured.slice(15, 20)} />

              {/* POLITICS & CRIME (DENSE LISTS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <NewsGrid title="Politics" articles={fPolitics} variant="list" link="/category/politics" />
                 <NewsGrid title="Crime Watch" articles={fCrime} variant="list" link="/category/crime" />
              </div>

              <div className="my-4 md:my-8">
                <AdBanner slot="mid_home_2" width={728} height={90}>
                    <NewsStripe articles={adSecondaryNews} title="National Briefing" />
                </AdBanner>
              </div>

              {/* SECONDARY CATEGORIES */}
              <NewsGrid title="Education & Career" articles={fEducation} variant="standard" limit={4} link="/category/education" />
              <NewsGrid title="Sports Hub" articles={fSports} variant="mixed" limit={6} link="/category/sports" />

            </div>

            {/* SIDEBAR (RHS) */}
            <aside className="lg:col-span-3 space-y-6 md:space-y-12">
              <div className="sticky top-24 space-y-12">
                  <AdBanner slot="sidebar_skyscraper" width={300} height={600}>
                      <NewsStripe articles={adSidebarNews} title="Quick Updates" variant="vertical" />
                  </AdBanner>
                  
                  {/* Sidebar Most Read */}
                  <div className="bg-[#fcfcfc] border-t-2 border-ndtv-black p-5">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-red mb-4 flex items-center gap-2">
                        <TrendingUp size={14} /> Most Shared Today
                    </h3>
                    <div className="space-y-4">
                        {allFeatured.slice(20, 25).map((s, i) => (
                            <Link key={i} href={`/news/${s.slug}`} className="group block">
                                <h4 className="text-[12px] font-bold text-gray-800 leading-snug group-hover:text-brand-red transition-colors line-clamp-3">
                                    {s.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                  </div>

                  <div className="bg-ndtv-black p-6 rounded-sm text-white">
                    <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-red mb-4">Morning Briefing</h4>
                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed">Get the digital morning highlights delivered to your inbox daily.</p>
                    <Link href="/contact" className="mt-6 block text-center py-3 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-white hover:text-brand-red transition-all">
                        Subscribe Now
                    </Link>
                  </div>
              </div>
            </aside>
          </div>
        </div>

        {/* TIER 3: CITY GRID (BOTTOM PACK) */}
        <CityGrid 
          cities={[
            { name: 'Garhwa', articles: data.garhwa },
            { name: 'Palamu', articles: data.palamu },
            { name: 'Latehar', articles: data.latehar },
            { name: 'Chatra', articles: data.chatra }
          ]} 
        />
      </div>
    </PublicLayout>
  )
}
