import React from "react";

export default function ArticleList({postList, setId}) {
  return postList.map(post => (
    <article key={post.id} className="App-artig">
      <header>
        <a href="#" onClick={() => {
          setId(post.id)
        }}>
          {post.title}
        </a>
      </header>
      <p>
        {post.excerpt}
      </p>
    </article>
  ))
}