// Main articles data store
export let articles = [];

// Check if we need to clear old data
const needsClear = localStorage.getItem('newsflash_articles') && 
                   JSON.parse(localStorage.getItem('newsflash_articles')).length === 3;

if (needsClear) {
    console.log('🧹 Clearing old 3-article cache...');
    localStorage.removeItem('newsflash_articles');
}

// Helper function to sort articles by date (newest first)
export function sortArticlesByDate(articlesArray) {
    return [...articlesArray].sort((a, b) => {
        // Convert dates to timestamps for comparison
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Descending order (newest first)
    });
}

// Full article data
const defaultArticles = [
  {
    id: 1,
    title: "Trump Signs AI Executive Order",
    description: "New framework allows government to vet advanced AI systems for national security risks up to 30 days before public release.",
    fullContent: "President Donald Trump signed an executive order Tuesday establishing a framework for the federal government to vet the national security risks of the most advanced AI systems for up to a month before their public release. The order, which makes participation by AI developers voluntary, creates a new oversight mechanism for cutting-edge artificial intelligence technology.\n\n'Advanced AI capabilities make our Nation stronger, but also introduce new national security considerations that require coordinated action across executive departments and agencies,' the order states.\n\nThe framework gives the government 30 days to review AI systems - a shorter timeframe than some industry observers expected.",
    category: "Technology",
    date: "2026-06-03",
    imageUrl: "img/713645403_1283591227279598_6718714325681598707_n.jpg",
    alt: "AI technology"
  },
  {
    id: 2,
    title: "Trump Proposes New Tariffs on China, Canada, Mexico",
    description: "10-12.5% tariffs proposed on dozens of trading partners over forced labor concerns.",
    fullContent: "The Trump administration is proposing that tariffs of 10% or more be imposed on products from dozens of major trading partners following a probe into imports of goods allegedly made with forced labor, according to a report released Wednesday by the U.S. Trade Representative.\n\nCanada, Mexico, Taiwan and the United Kingdom would face 10% additional tariffs for allegedly failing to enforce a forced labor import ban. A 12.5% additional tariff would be imposed on China, Japan, India, South Korea, Brazil and Switzerland.\n\n'The failure of our most important trading partners to address the importation of goods made with forced labor is unacceptable,' USTR Ambassador Jamieson Greer said.",
    category: "Business",
    date: "2026-06-03",
    imageUrl: "img/717878026_122113650432213283_8764833051096773540_n.jpg",
    alt: "Trade tariffs"
  },
  {
    id: 3,
    title: "NATO Chief Makes Unannounced Visit to Kyiv",
    description: "Mark Rutte visits Ukraine after Russian missile attacks killed 23 people.",
    fullContent: "NATO Secretary General Mark Rutte arrived in Kyiv on Wednesday for an unannounced trip following a series of large-scale fatal Russian attacks on Ukraine. The visit comes as Ukrainian President Volodymyr Zelensky continues appealing to defense bloc members for help protecting Ukraine from Russian ballistic missile attacks.\n\nA spokesman confirmed Rutte arrived along with NATO ambassadors from alliance member countries. 'We are gladly welcoming NATO Secretary General Mark Rutte. This visit is extremely important because it is a gesture of solidarity and support from the Alliance for our country.'",
    category: "World",
    date: "2026-06-03",
    imageUrl: "img/article_1780656207833.jpg",
    alt: "NATO in Kyiv"
  },
  {
    id: 4,
    title: "US Economy Adds 275,000 Jobs in May",
    description: "Unemployment drops to 3.8% as labor market exceeds expectations.",
    fullContent: "The U.S. economy added 275,000 jobs in May, far exceeding Wall Street expectations of 180,000, while the unemployment rate fell to 3.8%, the Labor Department reported Friday. The strong jobs report comes as a powerful signal of economic resilience despite ongoing trade tensions and global uncertainty.\n\nWage growth accelerated 4.2% year-over-year, providing relief to households grappling with lingering inflation. Sectors showing the strongest growth included healthcare (+65,000), leisure and hospitality (+52,000), and construction (+35,000).",
    category: "Business",
    date: "2026-06-02",
    imageUrl: "img/article_1780656456943.jpg",
    alt: "Jobs report"
  },
  {
    id: 5,
    title: "Trump Unveils $500 Billion Infrastructure Plan",
    description: "'America First Roads' would rebuild highways, bridges, and expand rural broadband.",
    fullContent: "President Donald Trump unveiled a sweeping $500 billion infrastructure plan Tuesday, calling it the 'most ambitious rebuilding of America since President Eisenhower created the Interstate Highway System.' The 10-year proposal, dubbed 'America First Roads,' would allocate $300 billion for highways and bridges, $100 billion for rural broadband expansion, and $100 billion for modernizing ports and airports.\n\n'We're going to build a future that our children and grandchildren will be proud of,' Trump said at a press conference. 'Cracked roads, crumbling bridges, and slow internet - that ends today.'",
    category: "News",
    date: "2026-06-01",
    imageUrl: "img/article_1780656491139.jpg",
    alt: "Infrastructure"
  },
  {
    id: 6,
    title: "Oil Prices Rise as Middle East Tensions Continue",
    description: "WTI climbs to $94.86 amid Iran uncertainty and stalled peace talks.",
    fullContent: "Oil prices extended gains Wednesday as Middle East peace talks stuttered, though stocks mostly rose on the back of continued demand for all things linked to artificial intelligence. West Texas Intermediate rose 1.2 percent to $94.86 a barrel, while Brent North Sea Crude gained 1.0 percent to $96.97.\n\nDespite President Donald Trump's assurances that the United States and Iran are edging closer to ending their three-month-long war and reopening the Strait of Hormuz, crude investors appear unmoved as they await solid progress.",
    category: "Business",
    date: "2026-05-30",
    imageUrl: "https://picsum.photos/id/43/400/240",
    alt: "Oil prices"
  },
  {
    id: 7,
    title: "Trump Meets with Saudi Crown Prince at White House",
    description: "Talks to focus on oil prices, regional stability, and economic cooperation.",
    fullContent: "President Donald Trump met Wednesday with Saudi Crown Prince Mohammed bin Salman at the White House for talks focused on oil prices, regional stability, and economic cooperation. The meeting comes as global energy markets remain volatile following recent tensions in the Gulf region.\n\n'We had a very productive discussion about strengthening the US-Saudi partnership,' Trump told reporters following the meeting. 'Saudi Arabia is a vital ally, and we're working together to ensure stable energy prices for American families.'",
    category: "News",
    date: "2026-05-28",
    imageUrl: "https://picsum.photos/id/48/400/240",
    alt: "Trump meeting"
  },
  {
    id: 8,
    title: "House Passes Border Security Bill with Bipartisan Support",
    description: "$25 billion for wall construction and 5,000 new border agents included.",
    fullContent: "The House of Representatives passed a comprehensive border security bill backed by President Trump in a 268-167 vote Wednesday, with 45 Democrats joining all 223 Republicans in support. The legislation represents the most significant border reform package in decades and now heads to the Senate for consideration.\n\nThe bill includes $25 billion for border wall construction, funding for 5,000 new Customs and Border Protection agents, expedited asylum processing that would reduce wait times from years to months, and enhanced technology for detecting illegal crossings.",
    category: "News",
    date: "2026-05-25",
    imageUrl: "https://picsum.photos/id/96/400/240",
    alt: "Border security"
  },
  {
    id: 9,
    title: "Debate Over Donald Trump's Long-Term Legacy Continues Across America",
    description: "A recent survey highlights ongoing divisions over how future generations may judge Donald Trump's presidency.",
    fullContent: "Public discussion surrounding the long-term legacy of former U.S. President Donald Trump has intensified following the release of a recent political survey examining how future generations may view his time in office.\n\nSupporters frequently point to economic initiatives, tax reforms, judicial appointments, border security efforts, and foreign policy decisions as major accomplishments that shaped the nation during his presidency. Many believe these policies will have a lasting impact on American politics for decades to come.\n\nCritics, however, argue that Trump's administration was marked by significant controversies, political polarization, and challenges to democratic institutions. They contend that these issues will remain central to historical assessments of his leadership.\n\nThe survey reflects the continuing divide in public opinion regarding Trump's influence on the United States. While some Americans view his presidency as transformative and consequential, others see it as one of the most controversial periods in modern political history.\n\nAs political debates continue and future elections shape the nation's direction, historians, political analysts, and citizens alike are expected to continue examining Trump's role and legacy in American history for years to come.",
    category: "Politics",
    date: "2026-06-04",
    imageUrl: "img/ID_9.png",
    alt: "Discussion surrounding the long-term legacy of Donald Trump"
  },
  {
    id: 10,
    title: "Experts Debate How AI Will Transform Jobs and Daily Life by 2030",
    description: "Artificial intelligence is rapidly changing workplaces and global industries.",
    fullContent: "Artificial intelligence is rapidly transforming workplaces and global industries. Experts from leading tech companies and academic institutions gathered at the Global AI Summit to discuss the future of work in an AI-driven world. Panelists predicted that by 2030, AI will have automated up to 30% of current工作任务 while creating new roles in AI maintenance, ethics, and development. The consensus was that education systems must adapt to prepare students for an AI-augmented workforce.",
    category: "Technology",
    date: "2026-06-04",
    imageUrl: "img/10.jpg",
    alt: "Artificial Intelligence and robotics"
  },
  {
    id: 11,
    title: "Rising Living Costs Continue to Impact Families Worldwide",
    description: "Inflation and economic pressure remain major global concerns.",
    fullContent: "Inflation and economic pressure remain major global concerns as families struggle with rising costs of food, housing, and energy. The World Bank released a report indicating that global inflation rates have stabilized but remain above pre-pandemic levels. Central banks around the world continue to adjust interest rates in an effort to balance economic growth with price stability.",
    category: "Business",
    date: "2026-06-04",
    imageUrl: "img/11.jpg",
    alt: "Economy and rising cost of living"
  },
  {
    id: 12,
    title: "Political Debate Continues Over U.S. Leadership and Policy Direction",
    description: "Experts and citizens remain divided on recent political developments.",
    fullContent: "Experts and citizens remain divided on recent political developments as the nation approaches the next election cycle. Key issues including healthcare, immigration, taxation, and foreign policy continue to dominate political discourse. Analysts suggest that voter turnout could reach record levels given the high stakes of upcoming decisions.",
    category: "Politics",
    date: "2026-06-04",
    imageUrl: "img/12.jpg",
    alt: "United States politics discussion"
  },
  {
    id: 13,
    title: "Fans Worldwide Prepare for the Upcoming FIFA World Cup",
    description: "The biggest football event is expected to attract global attention.",
    fullContent: "The biggest football event is expected to attract global attention as host nations complete final preparations. Stadiums have been upgraded, security measures implemented, and millions of fans are planning travel to attend matches. Organizers predict record-breaking viewership both in stadiums and through broadcast partners worldwide.",
    category: "Sports",
    date: "2026-06-04",
    imageUrl: "img/13.jpg",
    alt: "Football stadium and crowd"
  },
  {
    id: 14,
    title: "Countries Accelerate Renewable Energy and Climate Action Plans",
    description: "Global efforts increase toward clean energy and environmental protection.",
    fullContent: "Global efforts increase toward clean energy and environmental protection as more than 100 countries have updated their climate commitments. Investments in solar, wind, and battery storage have reached all-time highs. Environmental organizations praise the progress but emphasize that accelerated action is still needed to meet Paris Agreement targets.",
    category: "Environment",
    date: "2026-06-04",
    imageUrl: "img/14.jpg",
    alt: "Renewable energy and climate action"
  },
  {
    id: 15,
    title: "Donald Trump and Congressional Leader Seen in Formal Political Meeting Sparks Online Debate",
    description: "A political-style graphic shows Donald Trump in a formal meeting setting, prompting discussion on presidential legacy and public opinion.",
    fullContent: "A political-style graphic showing Donald Trump in a formal meeting setting has sparked widespread online discussion about presidential legacy and public opinion. The image, which circulated widely on social media platforms, prompted debate about Trump's ongoing influence in Republican politics and potential future political ambitions.",
    category: "Politics",
    date: "2026-06-04",
    imageUrl: "img/15.jpg",
    alt: "Donald Trump political meeting graphic with congressional leader and headline text"
  },
  {
    id: 16,
    title: "Grandson Shares Emotional Story Praising Hard Work and Dedication of Former President Trump",
    description: "A 60-year-old man shares his personal reflections about President Trump's work ethic and dedication, expressing admiration for his continued public service.",
    fullContent: "A 60-year-old man shares his personal reflections about President Trump's work ethic and dedication, expressing admiration for his continued public service and calling for prayers and blessings for his health and strength. The emotional tribute has resonated with many supporters who view Trump as a tireless advocate for American interests.",
    category: "Opinion",
    date: "2026-06-04",
    imageUrl: "img/16.jpg",
    alt: "American flag and political background representing leadership and national politics"
  },
  {
    id: 17,
    title: "Freedom 250 Faces Scrutiny Over Funding and Corporate Involvement",
    description: "The Freedom 250 initiative is under scrutiny from watchdog groups and lawmakers over its public-private funding model.",
    fullContent: "The Freedom 250 initiative is under scrutiny from watchdog groups and lawmakers over its public-private funding model and involvement of major tech and defense contractors including Oracle, Palantir, Deloitte, and Lockheed Martin. Critics question the transparency of the funding structure and potential conflicts of interest, while supporters argue that public-private partnerships are essential for achieving ambitious national goals.",
    category: "Politics",
    date: "2026-06-04",
    imageUrl: "img/17.jpg",
    alt: "Government and politics concept image"
  },
  {
    id: 18,
    title: "DOJ to cancel $1.776B Anti-Weaponization Fund after fierce blowback from GOP in Congress",
    description: "DOJ to cancel $1.776B Anti-Weaponization Fund after fierce blowback from GOP in Congress",
    fullContent: "The Department of Justice announced it will cancel the $1.776 billion Anti-Weaponization Fund following intense criticism from Republican members of Congress. The fund, which was established to prevent the weaponization of government agencies for political purposes, faced opposition from GOP lawmakers who argued it was redundant and wasteful. DOJ officials stated they would redirect the funds to other priorities including border security and counter-terrorism efforts.",
    category: "News",
    date: "2026-06-04",
    imageUrl: "img/18.jpg",
    alt: "Government and politics concept image"
  }
];

// Set the articles and sort them (newest first)
articles.push(...sortArticlesByDate(defaultArticles));

// Save articles to localStorage
export function saveArticles() {
    // Sort before saving
    articles = sortArticlesByDate(articles);
    localStorage.setItem('newsflash_articles', JSON.stringify(articles));
    console.log('✅ Articles saved to localStorage:', articles.length, 'articles');
    return true;
}

// Load articles from localStorage
export function loadArticlesFromStorage() {
    const stored = localStorage.getItem('newsflash_articles');
    if (stored && stored !== 'undefined') {
        try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.length > 0 && parsed.length !== 3) {
                console.log('📦 Loaded from localStorage:', parsed.length, 'articles');
                articles.length = 0;
                // Sort after loading
                articles.push(...sortArticlesByDate(parsed));
                return articles;
            } else if (parsed && parsed.length === 3) {
                console.log('⚠️ Found old 3-article cache, ignoring and using default');
                localStorage.removeItem('newsflash_articles');
            }
        } catch(e) {
            console.error('Error loading from localStorage:', e);
        }
    }
    console.log('📁 Using default articles from data.js:', articles.length, 'articles');
    return articles;
}

// Function to add a new article (auto-sorted to show first)
export function addArticle(newArticle) {
    // Generate new ID if not provided
    if (!newArticle.id) {
        const maxId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) : 0;
        newArticle.id = maxId + 1;
    }
    
    // Add to array
    articles.push(newArticle);
    
    // Sort by date (newest first)
    articles = sortArticlesByDate(articles);
    
    // Save to localStorage
    saveArticles();
    
    console.log('✨ New article added and sorted to top!');
    return newArticle;
}

// Auto-load on import
loadArticlesFromStorage();

// Make functions available globally
if (typeof window !== 'undefined') {
    window.articles = articles;
    window.saveArticles = saveArticles;
    window.loadArticlesFromStorage = loadArticlesFromStorage;
    window.addArticle = addArticle;
    window.sortArticlesByDate = sortArticlesByDate;
}