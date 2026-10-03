function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          My Portfolio
        </h1>

        <div className="flex gap-6">
          <a href="#home" className="hover:text-gray-600">
            Home
          </a>

          <a href="#about" className="hover:text-gray-600">
            About
          </a>

          <a href="#projects" className="hover:text-gray-600">
            Projects
          </a>

          <a href="#services" className="hover:text-gray-600">
            Services
          </a>

          <a href="#skills" className="hover:text-gray-600">
            Skills
          </a>

          <a href="#experience" className="hover:text-gray-600">
            Experience
          </a>

          <a href="#blog" className="hover:text-gray-600">
            Blog
          </a>

          <a href="#contact" className="hover:text-gray-600">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;