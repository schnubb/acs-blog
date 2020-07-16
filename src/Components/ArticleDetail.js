import React from "react";

export default function ArticleDetail({ article, setPost }) {



  return (
    <article>
      <header>
        <h1>{article.title}</h1>
      </header>
      <div dangerouslySetInnerHTML={{__html: article.content.html}} />
      <footer>
        <a href="#" onClick={() => {
          setPost(null)
        }}>Zurück</a>
      </footer>
    </article>
  )
}