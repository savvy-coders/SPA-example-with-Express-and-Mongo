import html from "html-literal";
export default (state) => html`
  <div class="container">
    <h1>RAG App Query Interface</h1>
    <form id="query-form">
      <div class="form-group">
        <label for="queryInput">Enter your user Id:</label>
        <input type="text" id="userIdInput" placeholder="user id input here" />
        <br />
        <label for="queryInput">Enter your query:</label>
        <input type="text" id="queryInput" placeholder="Ask away!" />
      </div>
      <button type="submit" class="btn">Submit Query</button>
    </form>
  </div>
  <h2>Responses:</h2>
  <div id="responseOutput">
    <table id="chats">
      <tr>
        <th>UserId</th>
        <th>Outgoing Message</th>
        <th>Response</th>
      </tr>
      ${state.conversations
        .map((message) => {
          return `<tr><td>${message.userId}</td><td>${message.message}</td><td>${message.response}</td></tr>`;
        })
        .join("")}
    </table>
  </div>
`;
