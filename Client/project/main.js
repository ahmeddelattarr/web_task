// home :
  async function fetchPosts()
  {
            const apiUrl = 'http://127.0.0.1:8000/api/posts/';

            try {
                const response = await fetch(apiUrl); // Make GET request
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const posts = await response.json();
                const container = document.getElementById('threads-container');

                // Clear the container
                container.innerHTML = '';

                // Dynamically generate threads
                posts.forEach(post => {
                    const threadHTML = `
                        <a href="Thread.html">
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

        // Call the function to fetch posts on page load
        fetchPosts();

   document.addEventListener('DOMContentLoaded', () => {
        // Select all navigation links
        const navLinks = document.querySelectorAll('.nav-link');

        // Function to set the active class
        const setActiveNav = (event) => {
            // Remove the 'active' class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add the 'active' class to the clicked link
            event.target.classList.add('active');
        };

        // Attach event listeners to all nav links
        navLinks.forEach(link => {
            link.addEventListener('click', setActiveNav);
        });

        // Automatically highlight the active link based on the current page
        const currentPath = window.location.pathname.split('/').pop(); // Get the current file name
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    });

   document.addEventListener('DOMContentLoaded', async () => {
    const apiBaseUrl = 'http://127.0.0.1:8000';
    const categoriesGrid = document.querySelector('.categories-grid');

    try {
        // Fetch categories from the API
        const response = await fetch(`${apiBaseUrl}/api/posts/?ordering=category`);

        // Handle potential errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();

        // Extract unique categories from posts
        const categories = [...new Set(posts.map(post => post.category))];

        // Generate HTML for each category
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
        categoriesGrid.innerHTML = `<p>Failed to load categories. Please try again later.</p>`;
    }
});

   document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category'); // Get category from URL query
    const apiBaseUrl = 'http://127.0.0.1:8000';
    const categoryThreadContainer = document.querySelector('.category-thread');

    try {
        if (!selectedCategory) {
            categoryThreadContainer.innerHTML = `<p style="color:red;">Category not specified!</p>`;
            return;
        }

        // Fetch posts filtered by the selected category
        const response = await fetch(`${apiBaseUrl}/api/posts/?ordering=category`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();

        // Filter posts by the selected category
        const filteredPosts = posts.filter(post => post.category === selectedCategory);

        if (filteredPosts.length === 0) {
            categoryThreadContainer.innerHTML = `<p>No threads found for the category: <strong>${selectedCategory}</strong></p>`;
            return;
        }

        // Render threads dynamically
        categoryThreadContainer.innerHTML = `
            <h5>Category: ${selectedCategory}</h5>
            ${filteredPosts
                .map(
                    post => `
                    <a href="Thread.html?postId=${post.id}">
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
                    `
                )
                .join('')}
        `;
    } catch (error) {
        console.error('Error fetching threads:', error);
        categoryThreadContainer.innerHTML = `<p style="color:red;">Failed to load threads. Please try again later.</p>`;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newThreadForm');
    const apiBaseUrl = 'http://127.0.0.1:8000';

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(form); // Gather form data

        try {
            const response = await fetch(`${apiBaseUrl}/api/posts/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Post created successfully!');
                form.reset(); // Clear the form
                window.location.href = 'Category.html'; // Redirect after successful submission
            } else {
                const errorData = await response.json();
                alert(`Failed to create post: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
const postId = 1; // Replace with dynamic post ID, based on your use case

document.addEventListener('DOMContentLoaded', () => {
    // Fetch thread details and comments when the page loads
    fetchThreadDetails(postId);
    fetchComments(postId);

    // Handle form submission for new comment
    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const author = commentForm.querySelector('input[name="author"]').value;
        const content = commentForm.querySelector('textarea[name="content"]').value;

        // Create a new comment
        addComment(postId, author, content);
    });
});

function fetchThreadDetails(postId) {
    fetch(`http://127.0.0.1:8000/api/posts/${postId}/`)
        .then(response => response.json())
        .then(thread => {
            document.getElementById('thread-title').textContent = thread.title;
            document.getElementById('thread-category').textContent = thread.category;
            document.getElementById('thread-content').textContent = thread.content;
        })
        .catch(error => console.error('Error fetching thread details:', error));
}

function fetchComments(postId) {
    fetch(`http://127.0.0.1:8000/api/comments/${postId}/`)
        .then(response => response.json())
        .then(comments => {
            const commentsSection = document.getElementById('comments-section');
            commentsSection.innerHTML = ''; // Clear any existing comments

            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('answer');

                const commentHeader = document.createElement('div');
                commentHeader.classList.add('answer-header');
                commentHeader.innerHTML = `<strong>${comment.author}</strong>`;

                const commentBody = document.createElement('div');
                commentBody.classList.add('answer-body');
                commentBody.innerHTML = `<p>${comment.content}</p>`;

                commentDiv.appendChild(commentHeader);
                commentDiv.appendChild(commentBody);
                commentsSection.appendChild(commentDiv);
            });

            // Update comment count
            document.getElementById('comment-count').textContent = `${comments.length} Comments`;
        })
        .catch(error => console.error('Error fetching comments:', error));
}

function addComment(postId, author, content) {
    fetch(`http://127.0.0.1:8000/api/comments/${postId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            author: author,
            content: content,
            post_id: postId,
        }),
    })
    .then(response => response.json())
    .then(newComment => {
        // Add the new comment to the comments section
        const commentsSection = document.getElementById('comments-section');
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('answer');

        const commentHeader = document.createElement('div');
        commentHeader.classList.add('answer-header');
        commentHeader.innerHTML = `<strong>${newComment.author}</strong>`;

        const commentBody = document.createElement('div');
        commentBody.classList.add('answer-body');
        commentBody.innerHTML = `<p>${newComment.content}</p>`;

        commentDiv.appendChild(commentHeader);
        commentDiv.appendChild(commentBody);
        commentsSection.appendChild(commentDiv);

        // Update comment count
        const currentCommentCount = parseInt(document.getElementById('comment-count').textContent);
        document.getElementById('comment-count').textContent = `${currentCommentCount + 1} Comments`;

        // Clear the form
        document.querySelector('input[name="author"]').value = '';
        document.querySelector('textarea[name="content"]').value = '';
    })
    .catch(error => console.error('Error adding comment:', error));
}
