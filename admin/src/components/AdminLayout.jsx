
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Blogs", path: "/blogs" },
    { name: "Experience", path: "/experience" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Services", path: "/services" },
    
  ];

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* Sidebar */}
      <aside className="w-full bg-slate-900 text-white md:min-h-screen md:w-64">
        <div className="border-b border-slate-700 px-6 py-5">
          <h1 className="text-xl font-bold">Portfolio CMS</h1>
          <p className="mt-1 text-sm text-slate-400">Admin Panel</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-slate-900"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-slate-700 pt-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm text-slate-500">
              Portfolio Management System
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-7xl p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;

