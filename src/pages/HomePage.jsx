import Program from "../components/Program";
import Course from "../components/Course";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [programShow, setProgramShow] = useState(false);
  const [courseShow, setCourseShow] = useState(false);
  const [programs, setPrograms] = useState([
    {
      name: "loading",
      id: "loading",
      term: "loading",
      start: "loading",
      end: "loading",
      fees: "loading",
      desc: "loading",
    },
  ]);
  const [featuredCourses, setFeaturedCourses] = useState([
    {
      name: "loading",
      code: "loading",
      term: "loading",
      start: "loading",
      end: "loading",
      desc: "loading",
    },
  ]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("/api/programs");
        if (!response.ok) {
          throw new Error("Failed to fetch programs");
        }
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchPrograms();

    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();

        // Shuffle course data set
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]]; // Swap elements
        }

        // Set the first 6 courses as featured courses
        if (data.length < 6) {
          setFeaturedCourses(data);
        } else {
          setFeaturedCourses(data.slice(0, 6));
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCourses();
  }, []);

  const navigate = useNavigate();

  const goToSignup = () => {
    navigate("/signup");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-xl font-bold">
          Welcome to the Software<br></br>Development Department
        </h1>
        <h3 className="text-xs">
          Register for courses and programs in Software Development.
        </h3>
      </div>
      <div className="flex flex-row gap-2 justify-center">
        <button
          onClick={goToSignup}
          className="btn-primary-fill py-1 px-3 text-sm"
        >
          Sign Up
        </button>
        <button onClick={goToLogin} className="btn-primary-outlined text-sm">
          <p className="py-1 px-3">Login</p>
        </button>
      </div>
      <div>
        <h2 className="font-semibold">Available Programs</h2>
        <div className="flex flex-row flex-wrap gap-2 mt-2 justify-center">
          {programs.slice(0, 3).map((p) => (
            <Program
              key={p.id}
              name={p.name}
              id={p.id}
              term={p.term}
              start={p.start}
              end={p.end}
              fees={p.fees}
              desc={p.desc}
            />
          ))}
          {programShow &&
            programs
              .slice(3)
              .map((p) => (
                <Program
                  key={p.id}
                  name={p.name}
                  id={p.id}
                  term={p.term}
                  start={p.start}
                  end={p.end}
                  fees={p.fees}
                  desc={p.desc}
                />
              ))}
        </div>
        {programs.length > 3 && (
          <button
            className="btn-primary-outlined mt-5 mx-auto block"
            onClick={() => setProgramShow(!programShow)}
          >
            {programShow ? (
              <p className="py-2 px-3">View Less Programs</p>
            ) : (
              <p className="py-2 px-3">View All Programs</p>
            )}
          </button>
        )}
      </div>
      <div>
        <h2 className="font-semibold">Featured Courses</h2>
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full divide-y divide-gray-200 border-[1px] border-[var(--system-purple)] mt-2">
            <thead className="bg-1 text-white">
              <tr className="text-xs font-medium">
                <td className="p-2">Course Name</td>
                <td className="p-2">Code</td>
                <td className="p-2">Term</td>
                <td className="p-2">Dates</td>
                <td className="p-2">Description</td>
              </tr>
            </thead>
            <tbody>
              {featuredCourses.slice(0, 3).map((p) => (
                <Course
                  key={p.code}
                  name={p.name}
                  code={p.code}
                  term={p.term}
                  start={p.start}
                  end={p.end}
                  desc={p.desc}
                />
              ))}
              {courseShow &&
                featuredCourses
                  .slice(3)
                  .map((p) => (
                    <Course
                      key={p.code}
                      name={p.name}
                      code={p.code}
                      term={p.term}
                      start={p.start}
                      end={p.end}
                      desc={p.desc}
                    />
                  ))}
            </tbody>
          </table>
        </div>
        {featuredCourses.length > 3 && (
          <button
            className="btn-primary-outlined mt-5 mx-auto block"
            onClick={() => setCourseShow(!courseShow)}
          >
            {courseShow ? (
              <p className="py-2 px-3">View Less Courses</p>
            ) : (
              <p className="py-2 px-3">View All Courses</p>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
