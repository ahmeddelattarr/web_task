

### API Endpoints Documentation

#### Posts

- **GET /api/posts/**: Retrieve a list of all posts.
- **POST /api/posts/**: Create a new post.
  - **Request Body**:
    - `author` (string): The author of the post.
    - `title` (string): The title of the post.
    - `content` (string): The content of the post.
    - `pics` (file, optional): An image file for the post.
    - `category` (string): The category of the post.
- **GET /api/posts/{id}/**: Retrieve a specific post by ID.
- **PUT /api/posts/{id}/**: Update a specific post by ID.
  - **Request Body**:
    - `author` (string): The author of the post.
    - `title` (string): The title of the post.
    - `content` (string): The content of the post.
    - `pics` (file, optional): An image file for the post.
    - `category` (string): The category of the post.
- **DELETE /api/posts/{id}/**: Delete a specific post by ID.

#### Comments

- **GET /api/posts/{post_id}/comments/**: Retrieve a list of all comments for a specific post.
- **POST /api/posts/{post_id}/comments/**: Create a new comment for a specific post.
  - **Request Body**:
    - `author` (string): The author of the comment.
    - `content` (string): The content of the comment.
    - `post_id` (integer): The ID of the post the comment belongs to.
