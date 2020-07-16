import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { graphcms } from "../package.json";
import ArticleList  from "./Components/ArticleList";
import ArticleDetail from "./Components/ArticleDetail";
import ArticleNew from "./Components/ArticleNew";

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

  const { coverImage } = post || {};

  return (
    <div className="App">
      <header className="App-header">
        {coverImage ? <img src={post.coverImage.url} alt="" onClick={() => { setPost(null)}} /> : <img src={logo} className="App-logo" alt="logo" /> }
        <p>
          <a className="App-link" href="https://github.com/schnubb/acs-blog">
            https://github.com/schnubb/acs-blog
          </a>
        </p>
      </header>

      {post === "new" ? (
        <ArticleNew setId={setId} />
      ) : (
        <main className="App-header">
          <section className="App-gehts">
            {post === null ? <ArticleList postList={postList} setId={setId} /> : <ArticleDetail article={post} setPost={setPost}/>}
          </section>
        </main>
      )}

      <aside className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </aside>

      <footer className="App-header">
        <a onClick={() => {
          setPost("new");
        }}>
          New Post
        </a>
      </footer>
    </div>
  );
}

export default App;
