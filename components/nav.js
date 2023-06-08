export default links => `
<nav>
  <i class="fas fa-bars"></i>
  <ul class="hidden--mobile nav-links">
  ${links
    .map(link => {
      const linkAttribute = link.external
        ? 'target="_blank"'
        : "data-navigo";
      return `<li>
        <a href="${link.url}" title="${link.text}" ${linkAttribute}>
          ${link.text}
        </a>
      </li>`;
    })
    .join("")}
  </ul>
</nav>
`;
