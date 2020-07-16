import React, { useState, useMemo } from "react";
import { graphcms } from "../../package.json";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const addPost = `
mutation addPost($title:String!, $slug:String!, $content:RichTextAST) {
  createPost(data: {
    title:$title,
    content: $content,
    slug: $slug
  }) {
    id,
    title
  }
}
`

const publishPost = `
mutation publish($id:ID) {
  publishPost(where: {id:$id}) {id}
}
`

export default function ArticleForm({setId}) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  const editor = useMemo(() => withReact(createEditor()), [])

  const submitPost = () => {
    fetch(graphcms.api, {
      method: "post",
      body: JSON.stringify({
        query: addPost,
        variables: {
          title: title,
          slug: title.toLowerCase().replace(" ", "-"),
          content: content[0]
        }
      })
    })
      .then(res => res.json())
      .then(({ data }) => {
        const id = data.createPost.id;
        fetch(graphcms.api, {
          method: "post",
          body: JSON.stringify( {
            query: publishPost,
            variables: {
              id: id
            }
          })
        })
          .then(res=>res.json())
          .then(({ data }) => {
            setId(data.publishPost.id);
          })
      }).catch(err => {
        if (err) throw new Error(err);
    })
  };

  return (
    <main className="App-header">
      <input value={title} name="title" onChange={(event) => {
        setTitle(event.target.value);
      }}/>
      <Slate editor={editor} value={content} onChange={newValue => setContent(newValue)}>
        <Editable />
      </Slate>
      <button onClick={() => {
        submitPost()
      }}>Submit</button>
    </main>
  )
}