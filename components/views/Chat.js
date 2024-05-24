// A basic chats view which renders a list of messages pulled from the messages array in the Chat.js store file
// It includes a form to add new messages to the list on submit

import html from "html-literal";

export default (state) => html`
<div class="container">
<h1>RAG App Query Interface</h1>
<form id="query-form">
    <div class="form-group">
        <label for="queryInput">Enter your user Id:</label>
        <input type="text" id="userIdInput" placeholder="user id input here">
<br>
        <label for="queryInput">Enter your query:</label>
        <input type="text" id="queryInput" placeholder="Ask away!">
    </div>
    <button type="submit" class="btn">Submit Query</button>
</form>
<h2>Responses:</h2>
<pre id="responseOutput">${state.messages.join("\n")}</pre>
</div>
`;

