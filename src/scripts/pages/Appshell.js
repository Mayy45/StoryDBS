// AppShell.js
export default function AppShell(content) {
  const header = '<header><h1>My Apps</h1></header>';
  const footer = '<footer>© 2025</footer>';
  return `${header}<main>${content}</main>${footer}`;
}
