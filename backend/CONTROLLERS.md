# Controllers Information
1. `/user`
```angular2html
PATH: /
TYPE: POST
REQ.AUTH = FALSE
REQ.BODY = {
    name: string
    email: string
    clerk_user_id: string
}

PATH: /projects
TYPE: GET
REQ.AUTH = TRUE
REQ.BODY = {}
```
2. `/project`
```angular2html
REQ.AUTH_FOR_ALL: TRUE

PATH: /
TYPE: POST
REQ.BODY = {
    title: string
    description: string
    editable_file: string
    non_editable_file: string
}

PATH: /?projectId="project_id_here"
TYPE: GET
REQ.BODY = {} // Response without messages

PATH: /
TYPE: PUT
REQ.BODY = {
    _id: string
    title: string
    description: string
    editable_file: string
    non_editable_file: string
}

PATH: /:projectId
TYPE: DELETE
REQ.BODY = {}
```
3. `/message`
```angular2html
REQ.AUTH_FOR_ALL: TRUE

PATH: /
TYPE: GET
REQ.BODY = {
    project_id: string
    message_id: string
}

PATH: /
TYPE: POST
REQ.BODY = {
    project_id: string
    message_id: string
    message: string
    website_content: string
    user_type: 'USER' | 'AI'
}
```
