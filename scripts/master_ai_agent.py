import json
import urllib.request
import urllib.parse
from datetime import datetime

# ==========================================
# 🚀 THINKINDIA.PRESS - ZERO-COST ENTERPRISE AI
# ==========================================

print("🌟 ThinkIndia.press Master AI Agent (Python Edition) 🌟")
print("-------------------------------------------------------")

# --- 1. g4f (GPT4Free) for Text Generation ---
# Note: You need to install g4f via `pip install -U g4f`
def generate_text_with_g4f(prompt):
    print("🤖 [Text AI] g4f के ज़रिए टेक्स्ट जनरेट हो रहा है...")
    try:
        import g4f
        response = g4f.ChatCompletion.create(
            model=g4f.models.llama3, # Open source model
            messages=[{"role": "user", "content": prompt}],
        )
        return response
    except Exception as e:
        print(f"⚠️ g4f Error: {e}")
        # Fallback to Pollinations Text API if g4f fails
        print("🤖 [Fallback] Pollinations API का इस्तेमाल हो रहा है...")
        url = "https://text.pollinations.ai/"
        data = json.dumps({"messages": [{"role": "user", "content": prompt}], "model": "mistral"}).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        response = urllib.request.urlopen(req)
        return response.read().decode('utf-8')

# --- 2. Pollinations for Image Generation ---
def generate_image_with_pollinations(prompt):
    print("🎨 [Image AI] Pollinations से फोटो बन रही है...")
    safe_prompt = urllib.parse.quote(prompt)
    url = f"https://pollinations.ai/p/{safe_prompt}?width=1280&height=720&model=flux&nologo=true"
    return url

# --- 3. Chatbot Logic ---
def chat_with_ai(question):
    print(f"\n🗣️ [Chatbot Query]: {question}")
    prompt = f"तुम 'ThinkIndia.press' के एक AI रिपोर्टर हो। इस सवाल का जवाब 2-3 लाइन में दो: {question}"
    answer = generate_text_with_g4f(prompt)
    print(f"🤖 [ThinkIndia.press AI]: {answer}\n")

# --- 4. News Scraper & Publisher ---
def auto_news_pipeline():
    print("\n📡 [Pipeline] Auto-News Pipeline शुरू हो रही है...")
    
    # 1. Scrape Headline (Mock RSS for Demo)
    headline = "झारखंड: रांची में नए स्टार्टअप हब का उद्घाटन, युवाओं को मिलेगा रोजगार"
    print(f"📰 हेडलाइन मिली: {headline}")

    # 2. Rewrite with g4f
    news_prompt = f"इस हेडलाइन पर 150 शब्दों की एक विस्तृत न्यूज़ रिपोर्ट हिंदी में लिखो: '{headline}'. इसे 'ThinkIndia.press' के रिपोर्टर के अंदाज़ में लिखो।"
    article_content = generate_text_with_g4f(news_prompt)
    print(f"\n📝 न्यूज़ ड्राफ्ट:\n{article_content}\n")

    # 3. Generate Image
    image_prompt = f"A professional news photography of startup hub inauguration in Ranchi, Jharkhand, high quality, 8k"
    image_url = generate_image_with_pollinations(image_prompt)
    print(f"🖼️ इमेज लिंक: {image_url}\n")

    # 4. JSON Output for Website
    final_output = {
        "title": headline,
        "content": article_content,
        "image_url": image_url,
        "date": datetime.now().isoformat()
    }
    
    # Save to file
    with open("latest_news_export.json", "w", encoding="utf-8") as f:
        json.dump(final_output, f, ensure_ascii=False, indent=4)
        
    print("✅ सफलता! न्यूज़ 'latest_news_export.json' में सेव हो गई है।")
    print("इसे GitHub Actions या Cron जॉब के ज़रिए WordPress/Next.js में भेजा जा सकता है।")

# ==========================================
# Run the Systems
# ==========================================
if __name__ == "__main__":
    # Test Chatbot
    chat_with_ai("झारखंड के मुख्यमंत्री कौन हैं और उनकी नई योजना क्या है?")
    
    # Test Auto-News
    auto_news_pipeline()
