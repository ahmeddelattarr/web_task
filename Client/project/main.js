
//fetch data of posts
// async always followed by await >> to wait for data to be loaded from API
// => ( arrow function ): to write function on 1 line
//${selectedCategory} >> $ :mean dynamic variable (word changes)


// home :

  async function fetchPosts()
  {
            const apiUrl = 'http://127.0.0.1:8000/api/posts/';
// try and catch >> try : to write code in it
                  //catch: to catch error in case find
            try {
                const response = await fetch(apiUrl); // Make GET request
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const posts = await response.json();
              //variable container to put on it code html that have id threads-container
                const container = document.getElementById('threads-container');

                // Clear the container to update date
                container.innerHTML = '';

                // Dynamically generate threads "html in backslash"
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//navbar:

   document.addEventListener('DOMContentLoaded', () => {
        // Select all navigation links
        const navLinks = document.querySelectorAll('.nav-link');

        // Function to set the active class >>to change color of this nav-link when I am in this page
        const setActiveNav = (event) => {
            // Remove the 'active' class from all links
            //forEach function >> to loop on all links and delete active class
            navLinks.forEach(link => link.classList.remove('active'));

            // Add the 'active' class to the clicked link
            event.target.classList.add('active');
        };

        // Attach event listeners to all nav links
        navLinks.forEach(link => {
            link.addEventListener('click', setActiveNav);
        });

        //  highlight the active link based on the current page
        const currentPath = window.location.pathname.split('/').pop(); // Get the current file name
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    });

   /////////////////////////////////////////////////////////////////////////////////////////////////////
// category :
//to get all category
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//category threads :

   document.addEventListener('DOMContentLoaded', async () => {
       //to find the page that i clicked
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category'); // Get category from URL query
    const apiBaseUrl = 'http://127.0.0.1:8000';
    const categoryThread = document.querySelector('.category-thread');

    try {
        //not found data in this category
        if (!selectedCategory) {
            categoryThread.innerHTML = `<p style="color:red;">Category not specified!</p>`;
            return;
        }
        const response = await fetch(`${apiBaseUrl}/api/posts/?ordering=category`);

     //.ok>> is a built-in function that check data loaded or not
        if (!response.ok) {
            //   function (throw nwe error) : to return error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
// in category thread  appear posts
        const posts = await response.json();

        // Filter posts by  category( if category = category )
        const filteredPosts = posts.filter(post => post.category === selectedCategory);

        if (filteredPosts.length === 0) {
            categoryThread.innerHTML = `<p>No threads found for the category: <strong>${selectedCategory}</strong></p>`;
            return;
        }

        // Render threads dynamically
        categoryThread.innerHTML = `
            <h5 class="CategTitle">Category : <span class="categtype">${selectedCategory}</span></h5>
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
        categoryThread.innerHTML = `<p style="color:red;">Failed to load threads. Please try again later.</p>`;
    }
});

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//new threads:

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newThreadForm');
    const apiBaseUrl = 'http://127.0.0.1:8000';

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); //( function to prevent data appear in url )

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
/////////////////////////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////
//search :

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const threadsContainer = document.getElementById("threads-container");
    const apiUrl = "http://127.0.0.1:8000/api/posts/";

    // Function to fetch posts
    const fetchPosts = async (query) => {
        try {
            const response = await fetch(`${apiUrl}?search=${query}`);// query >> input that user use
            if (!response.ok) throw new Error("Failed to fetch posts");
            const data = await response.json();
            renderPosts(data);
        } catch (error) {
            console.error(error);
            threadsContainer.innerHTML = `<p>Error fetching posts. Please try again later.</p>`;
        }
    };

    // Function to render posts
    const renderPosts = (posts) => {
        threadsContainer.innerHTML = ""; // Clear existing posts
        if (posts.length === 0) {
            threadsContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
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
                        </div>>
            `;
            threadsContainer.appendChild(postElement);
        });
    };

    // Event listener for search input (query)
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchPosts(query);
        } else {
            threadsContainer.innerHTML = "";
        }
    });
});

