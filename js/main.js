// ============================================
// NEWSFLASH - MAIN SITE WITH ADMIN INTEGRATION
// ============================================

import { articles, loadArticlesFromStorage, saveArticles } from './data.js';

// Force load from localStorage (admin panel data)
loadArticlesFromStorage();

// Global variables
let currentCategory = 'all';
let currentSearchTerm = '';
let currentArticle = null;

// DOM Elements
const newsGridContainer = document.getElementById('newsGridContainer');
const categoryContainer = document.getElementById('categoryContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const resetAllBtn = document.getElementById('resetAllBtn');
const fullArticlePage = document.getElementById('fullArticlePage');
const backToNewsBtn = document.getElementById('backToNewsBtn');
const fullArticleImage = document.getElementById('fullArticleImage');
const fullArticleTitle = document.getElementById('fullArticleTitle');
const fullArticleCategory = document.getElementById('fullArticleCategory');
const fullArticleDate = document.getElementById('fullArticleDate');
const fullArticleContent = document.getElementById('fullArticleContent');
const relatedArticlesContainer = document.getElementById('relatedArticlesContainer');

// Set live date
function setLiveDate() {
    const liveDateSpan = document.getElementById('liveDate');
    if (liveDateSpan) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        liveDateSpan.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

// Get unique categories from articles
function getUniqueCategories() {
    const categories = new Set(articles.map(article => article.category));
    return ['all', ...Array.from(categories).sort()];
}

// Render category buttons
function renderCategories() {
    const categories = getUniqueCategories();
    categoryContainer.innerHTML = categories.map(cat => `
        <button class="cat-btn ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
            ${cat === 'all' ? 'All News' : cat}
        </button>
    `).join('');
    
    // Add event listeners to category buttons
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            renderCategories();
            filterAndRenderNews();
        });
    });
}

// Filter articles based on category and search
function filterArticles() {
    let filtered = [...articles];
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(article => article.category === currentCategory);
    }
    
    // Filter by search term
    if (currentSearchTerm) {
        const term = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(term) ||
            article.description.toLowerCase().includes(term) ||
            (article.fullContent && article.fullContent.toLowerCase().includes(term))
        );
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Fix image URL if broken
function fixImageUrl(url) {
    if (!url) return 'img/placeholder.jpg';
    if (url.includes('via.placeholder.com')) return 'img/placeholder.jpg';
    if (url.includes('placeholder')) return 'img/placeholder.jpg';
    return url;
}

// Render news cards
function renderNews() {
    const filtered = filterArticles();
    
    if (filtered.length === 0) {
        newsGridContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-newspaper"></i>
                <h3>No articles found</h3>
                <p>Try adjusting your search or category filter</p>
                <button onclick="resetAllFilters()" class="reset-btn">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    newsGridContainer.innerHTML = filtered.map(article => `
        <article class="news-card" data-id="${article.id}">
            <div class="card-image">
                <img src="${fixImageUrl(article.imageUrl)}" alt="${article.alt || article.title}" loading="lazy" onerror="this.src='img/placeholder.jpg'">
                <span class="card-category">${article.category}</span>
            </div>
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description.substring(0, 120)}${article.description.length > 120 ? '...' : ''}</p>
                <div class="card-footer">
                    <span class="card-date"><i class="far fa-calendar-alt"></i> ${formatDate(article.date)}</span>
                    <button class="read-more-btn" data-id="${article.id}">Read More <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </article>
    `).join('');
    
    // Add event listeners to read more buttons
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            showFullArticle(id);
        });
    });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Filter and render
function filterAndRenderNews() {
    renderNews();
}

// Reset all filters
window.resetAllFilters = function() {
    currentCategory = 'all';
    currentSearchTerm = '';
    if (searchInput) searchInput.value = '';
    renderCategories();
    renderNews();
};

// Show full article
function showFullArticle(id) {
    currentArticle = articles.find(a => a.id === id);
    if (!currentArticle) return;
    
    // Hide news grid, show full article page
    const actionBar = document.querySelector('.action-bar');
    const categoriesWrap = document.getElementById('categoriesWrap');
    const ads = document.querySelectorAll('.ad-container');
    
    if (actionBar) actionBar.style.display = 'none';
    if (categoriesWrap) categoriesWrap.style.display = 'none';
    ads.forEach(ad => ad.style.display = 'none');
    if (newsGridContainer) newsGridContainer.style.display = 'none';
    if (fullArticlePage) fullArticlePage.style.display = 'block';
    
    // Populate full article
    fullArticleImage.src = fixImageUrl(currentArticle.imageUrl);
    fullArticleImage.alt = currentArticle.alt || currentArticle.title;
    fullArticleTitle.textContent = currentArticle.title;
    fullArticleCategory.textContent = currentArticle.category;
    fullArticleDate.textContent = formatDate(currentArticle.date);
    
    // Format content with paragraphs
    let content = currentArticle.fullContent || currentArticle.description;
    content = content.replace(/\n\n/g, '</p><p>');
    content = `<p>${content}</p>`;
    fullArticleContent.innerHTML = content;
    
    // Load related articles
    loadRelatedArticles(id);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load related articles
function loadRelatedArticles(currentId) {
    const current = articles.find(a => a.id === currentId);
    const related = articles
        .filter(a => a.id !== currentId && a.category === current?.category)
        .slice(0, 3);
    
    if (related.length === 0) {
        relatedArticlesContainer.innerHTML = '<p>No related articles found.</p>';
        return;
    }
    
    relatedArticlesContainer.innerHTML = related.map(article => `
        <div class="related-card" onclick="showFullArticle(${article.id})">
            <img src="${fixImageUrl(article.imageUrl)}" alt="${article.alt}" onerror="this.src='img/placeholder.jpg'">
            <div class="related-content">
                <h4>${article.title}</h4>
                <small>${formatDate(article.date)}</small>
            </div>
        </div>
    `).join('');
}

// Back to news
if (backToNewsBtn) {
    backToNewsBtn.addEventListener('click', () => {
        const actionBar = document.querySelector('.action-bar');
        const categoriesWrap = document.getElementById('categoriesWrap');
        const ads = document.querySelectorAll('.ad-container');
        
        if (actionBar) actionBar.style.display = 'flex';
        if (categoriesWrap) categoriesWrap.style.display = 'block';
        ads.forEach(ad => ad.style.display = 'block');
        if (newsGridContainer) newsGridContainer.style.display = 'grid';
        if (fullArticlePage) fullArticlePage.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        if (clearSearchBtn) {
            clearSearchBtn.style.display = currentSearchTerm ? 'block' : 'none';
        }
        filterAndRenderNews();
    });
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchTerm = '';
        clearSearchBtn.style.display = 'none';
        filterAndRenderNews();
    });
}

if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
        resetAllFilters();
    });
}

// Make functions global for onclick
window.showFullArticle = showFullArticle;
window.resetAllFilters = resetAllFilters;

// Login Modal functionality
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.querySelector('.close-login');
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const submitLoginBtn = document.getElementById('submitLoginBtn');
const submitSignupBtn = document.getElementById('submitSignupBtn');
const userDropdown = document.getElementById('userDropdown');
const userNameDisplay = document.getElementById('userNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// Check for logged in user
function checkLoggedInUser() {
    const user = localStorage.getItem('newsflash_user');
    if (user && loginBtn && userDropdown) {
        const userData = JSON.parse(user);
        loginBtn.style.display = 'none';
        userDropdown.style.display = 'flex';
        if (userNameDisplay) userNameDisplay.textContent = userData.name;
    }
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'flex';
    });
}

if (closeLogin) {
    closeLogin.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

if (tabBtns) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            if (tab === 'login') {
                if (loginForm) loginForm.classList.add('active');
                if (signupForm) signupForm.classList.remove('active');
            } else {
                if (loginForm) loginForm.classList.remove('active');
                if (signupForm) signupForm.classList.add('active');
            }
        });
    });
}

if (submitLoginBtn) {
    submitLoginBtn.addEventListener('click', () => {
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        const message = document.getElementById('loginMessage');
        
        const users = JSON.parse(localStorage.getItem('newsflash_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('newsflash_user', JSON.stringify({ name: user.name, email: user.email }));
            if (message) {
                message.style.color = 'green';
                message.textContent = 'Login successful!';
            }
            setTimeout(() => {
                if (loginModal) loginModal.style.display = 'none';
                checkLoggedInUser();
            }, 1000);
        } else {
            if (message) {
                message.style.color = 'red';
                message.textContent = 'Invalid email or password';
            }
        }
    });
}

if (submitSignupBtn) {
    submitSignupBtn.addEventListener('click', () => {
        const name = document.getElementById('signupName')?.value;
        const email = document.getElementById('signupEmail')?.value;
        const password = document.getElementById('signupPassword')?.value;
        const confirm = document.getElementById('signupConfirm')?.value;
        const message = document.getElementById('signupMessage');
        
        if (!name || !email || !password || !confirm) {
            if (message) {
                message.style.color = 'red';
                message.textContent = 'Please fill all fields';
            }
            return;
        }
        
        if (password !== confirm) {
            if (message) {
                message.style.color = 'red';
                message.textContent = 'Passwords do not match';
            }
            return;
        }
        
        if (password.length < 6) {
            if (message) {
                message.style.color = 'red';
                message.textContent = 'Password must be at least 6 characters';
            }
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('newsflash_users') || '[]');
        if (users.find(u => u.email === email)) {
            if (message) {
                message.style.color = 'red';
                message.textContent = 'Email already exists';
            }
            return;
        }
        
        users.push({ name, email, password });
        localStorage.setItem('newsflash_users', JSON.stringify(users));
        
        if (message) {
            message.style.color = 'green';
            message.textContent = 'Account created! Please login.';
        }
        
        setTimeout(() => {
            const loginTab = document.querySelector('.tab-btn[data-tab="login"]');
            if (loginTab) loginTab.click();
            const loginEmail = document.getElementById('loginEmail');
            if (loginEmail) loginEmail.value = email;
            const loginPassword = document.getElementById('loginPassword');
            if (loginPassword) loginPassword.value = '';
        }, 1500);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('newsflash_user');
        if (loginBtn) loginBtn.style.display = 'block';
        if (userDropdown) userDropdown.style.display = 'none';
    });
}

// Initialize
function init() {
    setLiveDate();
    renderCategories();
    renderNews();
    checkLoggedInUser();
    
    // Log status
    console.log(`✅ NewsFlash initialized with ${articles.length} articles from ${localStorage.getItem('newsflash_articles') ? 'admin panel' : 'default data'}`);
}

// Start the app
init();