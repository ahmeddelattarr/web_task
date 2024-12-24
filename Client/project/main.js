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
                                    <h2>${post.title}</h2>
                                    <div class="thread-meta">
                                        <span class="category">${post.category || 'Uncategorized'}</span>
                                        <span class="comments">
                                            <i class="fa-solid fa-comment"></i> ${post.commentsCount || 0} Comments
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