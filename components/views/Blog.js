import html from "html-literal";

export default st => html`
  <section id="blog">
    ${st.posts
      .map(post => {
        return formatBlogPost(post);
      })
      .join("")}
  </section>
`;

function formatBlogPost(post) {
  return `
    <div class="blog-post">
      <h4>${post.title} by User ${post.userId}</h4>
      <p>${post.body}</p>
    </div>
  `;
}