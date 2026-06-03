import { articles } from './data.js';

console.log('✅ main.js loaded');
console.log(`📰 Found ${articles.length} articles`);

const categoryContainer = document.getElementById('categoryContainer');
const newsGrid = document.getElementById('newsGridContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const resetAllBtn = document.getElementById('resetAllBtn');
const liveDateSpan = document.getElementById('liveDate');

// Full article page elements
const fullArticlePage = document.getElementById('fullArticlePage');
const fullArticleImage = document.getElementById('fullArticleImage');
const fullArticleTitle = document.getElementById('fullArticleTitle');
const fullArticleCategory = document.getElementById('fullArticleCategory');
const fullArticleDate = document.getElementById('fullArticleDate');
const fullArticleContent = document.getElementById('fullArticleContent');
const backToNewsBtn = document.getElementById('backToNewsBtn');
const homeLogo = document.getElementById('homeLogo');

let activeCategory = 'All';
let searchQuery = '';

// Sort by newest first
function sortByNewest(articlesArray) {
  return [...articlesArray].sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.id - a.id;
  });
}

// Custom category order
function getCategories() {
  const cats = [...new Set(articles.map(a => a.category))];
  const customOrder = ['All', 'News'];
  const sorted = [
    ...customOrder.filter(c => cats.includes(c) || c === 'All'),
    ...cats.filter(c => !customOrder.includes(c)).sort()
  ];
  return [...new Set(sorted)];
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function renderCategories() {
  const categories = getCategories();
  categoryContainer.innerHTML = '';
  
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `cat-btn ${activeCategory === cat ? 'active' : ''}`;
    
    let icon = '';
    switch(cat) {
      case 'All': icon = '🌐 '; break;
      case 'News': icon = '📰 '; break;
      case 'Technology': icon = '💻 '; break;
      case 'Business': icon = '📈 '; break;
      case 'Health': icon = '❤️ '; break;
      case 'Sports': icon = '⚽ '; break;
      case 'World': icon = '🌍 '; break;
      default: icon = '📁 ';
    }
    
    btn.innerHTML = `${icon}${cat}`;
    
    btn.addEventListener('click', () => {
      activeCategory = cat;
      renderCategories();
      renderNews();
    });
    categoryContainer.appendChild(btn);
  });
}

function getFilteredArticles() {
  let filtered = [...articles];
  
  if (activeCategory !== 'All') {
    filtered = filtered.filter(a => a.category === activeCategory);
  }
  
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.description.toLowerCase().includes(q)
    );
  }
  
  return sortByNewest(filtered);
}

// Show full article in same page
function showFullArticle(articleId) {
  const article = articles.find(a => a.id === parseInt(articleId));
  
  if (!article) return;
  
  // Hide news grid and show full article page
  newsGrid.classList.add('hide');
  fullArticlePage.classList.add('active');
  document.getElementById('categoriesWrap').style.display = 'none';
  document.querySelector('.action-bar').style.display = 'none';
  
  // Set full article content
  fullArticleImage.src = article.imageUrl;
  fullArticleImage.alt = article.alt || article.title;
  fullArticleTitle.textContent = article.title;
  fullArticleCategory.textContent = `📁 ${article.category}`;
  fullArticleCategory.style.background = article.category === 'News' ? '#2563eb' : '#eef2ff';
  fullArticleCategory.style.color = article.category === 'News' ? 'white' : '#1e40af';
  fullArticleDate.textContent = `📅 ${formatDate(article.date)}`;
  
  // Format content with paragraphs
  const content = article.fullContent || article.description;
  const paragraphs = content.split(/\n\n+/);
  const formattedContent = paragraphs.map(p => {
    if (p.trim()) return `<p>${escapeHtml(p.trim())}</p>`;
    return '';
  }).join('');
  
  fullArticleContent.innerHTML = formattedContent || `<p>${escapeHtml(content)}</p>`;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Go back to news grid
function backToNews() {
  newsGrid.classList.remove('hide');
  fullArticlePage.classList.remove('active');
  document.getElementById('categoriesWrap').style.display = 'block';
  document.querySelector('.action-bar').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderNews() {
  const filtered = getFilteredArticles();
  
  if (filtered.length === 0) {
    newsGrid.innerHTML = `<div class="no-results"><i class="fas fa-newspaper"></i><h3>No matching stories</h3><p>Try another category or search term</p></div>`;
    return;
  }
  
  newsGrid.innerHTML = filtered.map(article => `
    <div class="news-card">
      <div class="card-img">
        <img src="${article.imageUrl}" alt="${article.alt || 'news image'}" loading="lazy" onerror="this.src='https://picsum.photos/id/1/400/240'">
      </div>
      <div class="card-content">
        <span class="meta-cat">📁 ${article.category}</span>
        <h3 class="news-title">${escapeHtml(article.title)}</h3>
        <p class="news-desc">${escapeHtml(article.description.substring(0, 150))}${article.description.length > 150 ? '...' : ''}</p>
        <div class="card-footer">
          <div class="date-info"><i class="far fa-calendar-alt"></i> ${formatDate(article.date)}</div>
          <button class="read-btn" data-id="${article.id}"><span>Read more</span> <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const articleId = btn.getAttribute('data-id');
      showFullArticle(articleId);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function updateSearch() {
  searchQuery = searchInput.value.trim();
  renderNews();
}

function fullReset() {
  activeCategory = 'All';
  searchInput.value = '';
  searchQuery = '';
  renderCategories();
  renderNews();
}

function setLiveDate() {
  const now = new Date();
  liveDateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${now.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
}

// Event listeners
searchInput.addEventListener('input', updateSearch);
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  updateSearch();
});
resetAllBtn.addEventListener('click', fullReset);
backToNewsBtn.addEventListener('click', backToNews);
homeLogo.addEventListener('click', backToNews);

setLiveDate();
renderCategories();
renderNews();

console.log('✅ NewsFlash ready! Click "Read more" to see full article on same page.');