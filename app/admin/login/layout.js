// This overrides the parent admin layout for the login page only
// so it renders WITHOUT the AdminShell (no sidebar/topbar)
export default function AdminLoginLayout({ children }) {
  return children;
}
