import html from "html-literal";

export default () => html`
  <form id="customerForm">
    <h2>Customer Identification</h2>
    <div>
      <label for="customer">Customer E-mail</label>
      <input type="email" name="customer" id="customer" placeholder="Enter E-mail" required/>
    </div>
    <input type="submit" name="submit" value="Identify" />
  </form>
`;