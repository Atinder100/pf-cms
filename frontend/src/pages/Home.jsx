
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/about"
        );
        setAbout(response.data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/skills"
        );
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/projects"
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/services"
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/blogs"
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/testimonials"
        );
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    const fetchExperience = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/experience"
        );
        setExperience(response.data);
      } catch (error) {
        console.error("Error fetching experience:", error);
      }
    };

    fetchAbout();
    fetchSkills();
    fetchProjects();
    fetchServices();
    fetchBlogs();
    fetchTestimonials();
    fetchExperience();
  }, []);

  if (!about) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <p className="text-lg text-gray-600">Loading...</p>
      </section>
    );
  }

  return (
    <div>
      {/* About Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">
            Welcome to my portfolio
          </p>

          <h1 className="text-5xl font-bold mb-4">
            {about.title}
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {about.description}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="border rounded-lg p-6 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-semibold">
                    {skill.name}
                  </h3>

                  <span className="text-gray-600">
                    {skill.proficiency}%
                  </span>
                </div>

                <p className="text-gray-600 mb-3">
                  {skill.category}
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-black h-3 rounded-full"
                    style={{
                      width: `${skill.proficiency}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>

                  {project.technologies &&
                    project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.technologies.map(
                          (technology, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  <div className="flex gap-4">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Live
                      </a>
                    )}

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-6 shadow-sm"
              >
                {service.icon && (
                  <div className="text-4xl mb-4 text-center">
                    {service.icon}
                  </div>
                )}

                <h3 className="text-2xl font-semibold mb-3 text-center">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Blog
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600">
                    {blog.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Testimonials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="border rounded-lg p-6 shadow-sm"
              >
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                )}

                <p className="text-gray-600 mb-5">
                  "{testimonial.message}"
                </p>

                <h3 className="text-xl font-semibold text-center">
                  {testimonial.name}
                </h3>

                {testimonial.role && (
                  <p className="text-gray-500 text-center mt-1">
                    {testimonial.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Experience
          </h2>

          <div className="space-y-8">
            {experience.map((item) => (
              <div
                key={item.id}
                className="border-l-4 border-black pl-6 py-2"
              >
                <h3 className="text-2xl font-semibold">
                  {item.role}
                </h3>

                <p className="text-lg font-medium text-gray-700 mt-1">
                  {item.company}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {item.start_date
                    ? new Date(item.start_date).toLocaleDateString()
                    : "Start date not available"}{" "}
                  -{" "}
                  {item.end_date
                    ? new Date(item.end_date).toLocaleDateString()
                    : "Present"}
                </p>

                <p className="text-gray-600 mt-3">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

