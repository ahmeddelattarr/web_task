

### API Endpoints Documentation

#### Posts

- **GET /api/posts/**: Retrieve a list of all posts.
- **POST /api/posts/**: Create a new post.
  - **Request Body**:
    - `author` (string): The author of the post.
    - `title` (string): The title of the post.
    - `content` (string): The content of the post.
    - `category` (string): The category of the post.
- **GET /api/posts/{id}/**: Retrieve a specific post by ID.
- **PUT /api/posts/{id}/**: Update a specific post by ID.
  - **Request Body**:
    - `author` (string): The author of the post.
    - `title` (string): The title of the post.
    - `content` (string): The content of the post.
    - `category` (string): The category of the post.
- **DELETE /api/posts/{id}/**: Delete a specific post by ID.

  2. **Search posts by title:**
   ```
   GET /api/posts/?search=example
   ```

3. **Order posts by category:**
   ```
   GET /api/posts/?ordering=category
   ```


#### Comments

- **GET /api/comments/{post_id}/**: Retrieve a list of all comments for a specific post.
- **POST /api/comments/{post_id}/**: Create a new comment for a specific post.
  - **Request Body**:
    - `author` (string): The author of the comment.
    - `content` (string): The content of the comment.
    - `post_id` (integer): The ID of the post the comment belongs to.
    - 
