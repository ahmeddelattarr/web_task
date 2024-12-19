### Database Schema Documentation

#### Posts Model

| Field    | Type       | Description                        |
|----------|------------|------------------------------------|
| author   | CharField  | max 50                              |
| title    | CharField  | max 100                             |
| content  | TextField  |                                    |
| pics     | ImageField | optional, stored in `pics/`        |
| category | CharField  | max 50                              |

#### Comment Model

| Field   | Type        | Description                                      |
|---------|-------------|--------------------------------------------------|
| post    | ForeignKey  | to `Posts`, cascade delete, `related_name='comments'` |
| author  | ForeignKey  | to `Posts`, cascade delete, `related_name='comments'` |
| content | TextField   |                                                  |