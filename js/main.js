import { articles } from './data.js';
import { initAuth, updateUIForUser } from './auth.js';

// DOM Elements
const categoryContainer = document.getElementById('categoryContainer');
const newsGrid = document.getElementById('newsGridContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const resetAllBtn = document.getElementById('resetAllBtn');
const liveDateSpan = document.getElementById('liveDate');
const fullArticlePage = document.getElementById('fullArticlePage');
const backToNewsBtn = document.getElementById('backToNewsBtn');
const homeLogo = document.getElementById('homeLogo');
const actionBar = document.getElementById('actionBar');
const categoriesWrap = document.getElementById('categoriesWrap');

let activeCategory = 'All';
let searchQuery = '';

// Helper Functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m] || m));
}

function sortByNewest(arr) {
  return [...arr].sort((a,b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
}

function getCategories() {
  const cats = [...new Set(articles.map(a => a.category))];
  return ['All', ...cats.sort()];
}

function renderCategories() {
  const categories = getCategories();
  categoryContainer.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `cat-btn ${activeCategory === cat ? 'active' : ''}`;
    btn.textContent = cat;
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
  if (activeCategory !== 'All') filtered = filtered.filter(a => a.category === activeCategory);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }
  return sortByNewest(filtered);
}

function getRandomRelated(currentId, count = 3) {
  const others = articles.filter(a => a.id !== parseInt(currentId));
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return others.slice(0, count);
}

function renderRelated(currentId) {
  const container = document.getElementById('relatedArticlesContainer');
  if (!container) return;
  const related = getRandomRelated(currentId, 3);
  if (related.length === 0) {
    container.innerHTML = '<p style="color:#6c86a3;">No related articles found.</p>';
    return;
  }
  container.innerHTML = related.map(a => `
    <div class="related-card" data-id="${a.id}">
      <div class="related-card-img"><img src="${a.imageUrl}" alt="${a.alt}" loading="lazy" onerror="this.src='https://picsum.photos/id/1/400/240'"></div>
      <div class="related-card-content">
        <span class="related-card-category">📁 ${a.category}</span>
        <div class="related-card-title">${escapeHtml(a.title)}</div>
        <div class="related-card-date"><i class="far fa-calendar-alt"></i> ${formatDate(a.date)}</div>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.related-card').forEach(card => {
    card.addEventListener('click', () => showFullArticle(card.dataset.id));
  });
}

function showFullArticle(articleId) {
  const article = articles.find(a => a.id === parseInt(articleId));
  if (!article) return;
  document.getElementById('fullArticleImage').src = article.imageUrl;
  document.getElementById('fullArticleTitle').textContent = article.title;
  document.getElementById('fullArticleCategory').innerHTML = `📁 ${article.category}`;
  document.getElementById('fullArticleDate').innerHTML = `📅 ${formatDate(article.date)}`;
  const paragraphs = (article.fullContent || article.description).split(/\n\n+/);
  document.getElementById('fullArticleContent').innerHTML = paragraphs.map(p => `<p>${escapeHtml(p.trim())}</p>`).join('');
  newsGrid.classList.add('hide');
  fullArticlePage.classList.add('active');
  if (actionBar) actionBar.classList.add('hide');
  if (categoriesWrap) categoriesWrap.classList.add('hide');
  renderRelated(articleId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToNews() {
  newsGrid.classList.remove('hide');
  fullArticlePage.classList.remove('active');
  if (actionBar) actionBar.classList.remove('hide');
  if (categoriesWrap) categoriesWrap.classList.remove('hide');
  window.scrollTo({ top: 0 });
}

function renderNews() {
  const filtered = getFilteredArticles();
  if (filtered.length === 0) {
    newsGrid.innerHTML = '<div class="no-results"><i class="fas fa-newspaper"></i><h3>No matching stories</h3><p>Try another category or search term</p></div>';
    return;
  }
  newsGrid.innerHTML = filtered.map(article => `
    <div class="news-card" data-id="${article.id}">
      <div class="card-img"><img src="${article.imageUrl}" alt="${article.alt}" loading="lazy" onerror="this.src='https://picsum.photos/id/1/400/240'"></div>
      <div class="card-content">
        <span class="meta-cat">📁 ${article.category}</span>
        <h3 class="news-title">${escapeHtml(article.title)}</h3>
        <p class="news-desc">${escapeHtml(article.description.substring(0, 120))}${article.description.length > 120 ? '...' : ''}</p>
        <div class="card-footer">
          <div class="date-info"><i class="far fa-calendar-alt"></i> ${formatDate(article.date)}</div>
          <div class="read-btn"><span>Read more</span> <i class="fas fa-arrow-right"></i></div>
        </div>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.related-card')) {
        const articleId = card.getAttribute('data-id');
        showFullArticle(articleId);
      }
    });
  });
}

// Initialize
function init() {
  liveDateSpan.innerHTML = new Date().toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  renderCategories();
  renderNews();
  initAuth();
  
  backToNewsBtn.addEventListener('click', backToNews);
  homeLogo.addEventListener('click', backToNews);
  
  searchInput.addEventListener('input', () => { searchQuery = searchInput.value.trim(); renderNews(); });
  clearSearchBtn.addEventListener('click', () => { searchInput.value = ''; searchQuery = ''; renderNews(); });
  resetAllBtn.addEventListener('click', () => { activeCategory = 'All'; searchInput.value = ''; searchQuery = ''; renderCategories(); renderNews(); });
}

init();