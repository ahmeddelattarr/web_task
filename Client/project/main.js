// Global API base URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// ================ HOME PAGE - POSTS FETCHING ================
async function fetchPosts() {
    const apiUrl = `${API_BASE_URL}/api/posts/`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();
        const container = document.getElementById('threads-container');
        container.innerHTML = '';

        posts.forEach(post => {
            const threadHTML = `
                <a href="Thread.html?id=${post.id}">
                    <div class="thread-container">
                        <div class="thread-header">
                            <h2>${post.author}</h2>
                            <h4>${post.title}</h4>
                            <div class="thread-meta">
                                <span class="category">${post.category || 'Uncategorized'}</span>
                                <span class="comments">
                                    <i class="fa-solid fa-comment"></i> Comments
                                </span>
                            </div>
                        </div>
                        <div class="thread-body">
                            <p>${post.content.substring(0, 100)}...</p>
                        </div>
                    </div>
                </a>
            `;
            container.innerHTML += threadHTML;
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        const container = document.getElementById('threads-container');
        container.innerHTML = '<p style="color: red;">Failed to load posts. Please try again later.</p>';
    }
}

// ================ NAVIGATION BAR ================
document.addEventListener('DOMContentLoaded', () => {
    // Navigation link handling
    const navLinks = document.querySelectorAll('.nav-link');

    const setActiveNav = (event) => {
        navLinks.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
    };

    navLinks.forEach(link => {
        link.addEventListener('click', setActiveNav);
    });

    const currentPath = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    switch (currentPage) {
        case 'home.html':
            fetchPosts();
            break;
        case 'Category.html':
            initializeCategories();
            break;
        case 'Category-Thread.html':
            initializeCategoryThreads();
            break;
        case 'Thread.html':
            initializeThreadDetails();
            break;
        case 'new-thread.html':
            initializeNewThreadForm();
            break;
    }
});

// ================ CATEGORIES PAGE ================
async function initializeCategories() {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/?ordering=category`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();
        const categories = [...new Set(posts.map(post => post.category))];

        categoriesGrid.innerHTML = categories
            .map(category => `
                <a href="Category-Thread.html?category=${encodeURIComponent(category)}">
                    <div class="category">
                        <i class="fa-solid fa-icons" style="color: #7f499d; font-size: 60px; margin-top: 25px"></i>
                        <span class="name">${category}</span>
                    </div>
                </a>
            `)
            .join('');
    } catch (error) {
        console.error('Error fetching categories:', error);
        categoriesGrid.innerHTML = '<p>Failed to load categories. Please try again later.</p>';
    }
}

// ================ CATEGORY THREADS PAGE ================
async function initializeCategoryThreads() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category');
    const categoryThread = document.querySelector('.category-thread');
    if (!categoryThread) return;

    try {
        if (!selectedCategory) {
            categoryThread.innerHTML = '<p style="color:red;">Category not specified!</p>';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/posts/?ordering=category`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();
        const filteredPosts = posts.filter(post => post.category === selectedCategory);

        if (filteredPosts.length === 0) {
            categoryThread.innerHTML = `<p>No threads found for the category: <strong>${selectedCategory}</strong></p>`;
            return;
        }

        categoryThread.innerHTML = `
            <h5 class="CategTitle">Category : <span class="categtype">${selectedCategory}</span></h5>
            ${filteredPosts
                .map(post => `
                    <a href="Thread.html?id=${post.id}">
                        <div class="thread-container">
                            <div class="thread-header">
                                <h2>${post.author}</h2>
                                <h2>${post.title}</h2>
                                <div class="thread-meta">
                                    <span class="category">${post.category}</span>
                                    <span class="comments">
                                        <i class="fa-solid fa-comment"></i> Comments
                                    </span>
                                </div>
                            </div>
                            <div class="thread-body">
                                <p style="color:black">${post.content.substring(0, 150)}...</p>
                            </div>
                        </div>
                    </a>
                `)
                .join('')}
        `;
    } catch (error) {
        console.error('Error fetching threads:', error);
        categoryThread.innerHTML = '<p style="color:red;">Failed to load threads. Please try again later.</p>';
    }
}

// ================ NEW THREAD PAGE ================
function initializeNewThreadForm() {
    const form = document.getElementById('newThreadForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Post created successfully!');
                form.reset();
                window.location.href = 'Category.html';
            } else {
                const errorData = await response.json();
                alert(`Failed to create post: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred. Please try again later.');
        }
    });
}

// ================ THREAD DETAILS PAGE ================
function initializeThreadDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        console.error('Post ID not found in the URL.');
        return;
    }

    fetchThreadDetails(postId);
    fetchComments(postId);

    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const author = commentForm.querySelector('input[name="author"]').value;
            const content = commentForm.querySelector('textarea[name="content"]').value;
            addComment(postId, author, content);
        });
    }
}

async function fetchThreadDetails(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const thread = await response.json();
        document.getElementById('thread-title').textContent = thread.title;
        document.getElementById('thread-category').textContent = thread.category;
        document.getElementById('thread-content').textContent = thread.content;
    } catch (error) {
        console.error('Error fetching thread details:', error);
    }
}

async function fetchComments(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/comments/${postId}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const comments = await response.json();
        const commentsSection = document.getElementById('comments-section');
        commentsSection.innerHTML = '';

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('answer');

            commentDiv.innerHTML = `
                <div class="answer-header">
                    <strong>${comment.author}</strong>
                </div>
                <div class="answer-body">
                    <p>${comment.content}</p>
                </div>
            `;
            commentsSection.appendChild(commentDiv);
        });

        document.getElementById('comment-count').textContent = `${comments.length} Comments`;
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

async function addComment(postId, author, content) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/comments/${postId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ author, content, post_id: postId }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const newComment = await response.json();
        const commentsSection = document.getElementById('comments-section');

        const commentDiv = document.createElement('div');
        commentDiv.classList.add('answer');
        commentDiv.innerHTML = `
            <div class="answer-header">
                <strong>${newComment.author}</strong>
            </div>
            <div class="answer-body">
                <p>${newComment.content}</p>
            </div>
        `;
        commentsSection.appendChild(commentDiv);

        // Update comment count
        const currentCount = parseInt(document.getElementById('comment-count').textContent);
        document.getElementById('comment-count').textContent = `${currentCount + 1} Comments`;

        // Clear form
        document.querySelector('input[name="author"]').value = '';
        document.querySelector('textarea[name="content"]').value = '';
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
    }
}

// ================ SEARCH FUNCTIONALITY ================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const threadsContainer = document.getElementById('threads-container');

    if (!searchInput || !threadsContainer) return;

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (!query) {
            threadsContainer.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/?search=${query}`);
            if (!response.ok) throw new Error('Failed to fetch posts');

            const posts = await response.json();
            if (posts.length === 0) {
                threadsContainer.innerHTML = '<p>No posts found.</p>';
                return;
            }

            threadsContainer.innerHTML = posts
                .map(post => `
                   <a href="Thread.html?id=${post.id}">
                    <div class="thread-container">
                        <div class="thread-header">
                            <h2>${post.author}</h2>
                            <h4>${post.title}</h4>
                            <div class="thread-meta">
                                <span class="category">${post.category || 'Uncategorized'}</span>
                                <span class="comments">
                                    <i class="fa-solid fa-comment"></i> Comments
                                </span>
                            </div>
                        </div>
                        <div class="thread-body">
                            <p>${post.content.substring(0, 100)}...</p>
                        </div>
                    </div>
                </a>
                `)
                .join('');
        } catch (error) {
            console.error('Error searching posts:', error);
            threadsContainer.innerHTML = '<p>Error searching posts. Please try again later.</p>';
        }
    });
});

// ================ UTILITY FUNCTIONS ================
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'home.html';
}