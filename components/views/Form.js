export default () => `
<form id="register" method="POST" action="">
  <h2> Add a photo to the gallery!</h2>
  <div>
    <label for="url">Photo URL:</label>
    <input type="text" name="url" id="url" placeholder="Enter Photo URL" required>
  </div>
  <div>
    <label for="title">Photo Title/Description:</label>
    <input type="text" name="title" id="title" placeholder="Enter Photo Description" required>
  </div>
  <input type="submit" name="submit" value="Submit Photo">
</form>
`;
