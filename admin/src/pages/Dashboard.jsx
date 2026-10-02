
import { Link } from "react-router-dom";

function Dashboard() {
  const sections = [
    {
      name: "About",
      description: "Manage your portfolio introduction and profile information.",
      path: "/about",
    },
    {
      name: "Skills",
      description: "Manage your technical skills and proficiency levels.",
      path: "/skills",
    },
    {
      name: "Projects",
      description: "Add and manage your portfolio projects.",
      path: "/projects",
    },
    {
      name: "Blogs",
      description: "Create and manage your blog posts.",
      path: "/blogs",
    },
    {
      name: "Experience",
      description: "Manage your professional experience and timeline.",
      path: "/experience",
    },
    {
      name: "Testimonials",
      description: "Manage testimonials displayed on your portfolio.",
      path: "/testimonials",
    },
    {
      name: "Services",
      description: "Manage the services you provide.",
      path: "/services",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome to your Portfolio CMS Admin Panel.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            CMS Sections
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            7
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Content Management
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            Active
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Authentication
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            Secure
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            API Status
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            Connected
          </p>
        </div>
      </div>

      {/* CMS Sections */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Manage Content
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a section to manage your portfolio content.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {section.name}
                </h3>

                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700">
                  →
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {section.description}
              </p>

              <div className="mt-5 text-sm font-medium text-slate-700">
                Manage {section.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

