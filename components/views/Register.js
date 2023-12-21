import html from "html-literal";

export default () => html`
  <form id="order" method="POST" action="">
    <h2>Register Customer</h2>
    <div>
      <label for="email">E-mail:</label>
      <input type="text" name="email" id="email" placeholder="Enter E-mail" required/>
    </div>
    <div>
      <label for="name">Name:</label>
      <input type="text" name="name" id="name" placeholder="Enter Name"/>
    </div>
    <input type="submit" name="submit" value="Register" />
  </form>
`;
