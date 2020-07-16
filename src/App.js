import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { graphcms } from "../package.json";
import ArticleList  from "./Components/ArticleList";
import ArticleDetail from "./Components/ArticleDetail";

const getPosts = `
query {
  posts {
    id,
    title,
    excerpt
  }
}`;

const getPost = `
query getPostById($id:ID!) {
  post (where: {id:$id}) {
    title,
    content {
      html
    },
    coverImage {
      url
    },
    author {
      name
    }
  }
}
`

function App() {

  const [postList, setPostList ] = useState([]);
  const [post, setPost] = useState(null);
  const [id, setId] = useState("");

  useEffect(() => {
    console.log(id);
    if (id === "") {
      fetch(graphcms.api, {
        method: "post",
        body: JSON.stringify({
          query: getPosts
        })
      })
        .then(res => res.json())
        .then(result => setPostList(result.data.posts))
        .catch(err => {
          if (err) throw new Error(err);
        })
    } else {
      fetch(graphcms.api, {
        method: "post",
        body: JSON.stringify({
          query: getPost,
          variables: {
            "id": id
          }
        })
      })
        .then(res => res.json())
        .then(result => setPost(result.data.post))
        .catch(err => {
          if (err) throw new Error(err);
        });
    }
  }, [id]);

  return (
    <div className="App">
      <header className="App-header">
        {post === null? <img src={logo} className="App-logo" alt="logo" /> : <img src={post.coverImage.url} alt="" />}

        <p>
          <a className="App-link" href="https://github.com/schnubb/acs-blog">
            https://github.com/schnubb/acs-blog
          </a>
        </p>

        <main>
          <section className="App-gehts">
            {post === null ? <ArticleList postList={postList} setId={setId} /> : <ArticleDetail article={post} setPost={setPost}/>}
          </section>
        </main>
        <aside>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </aside>
      </header>
    </div>
  );
}

export default App;
