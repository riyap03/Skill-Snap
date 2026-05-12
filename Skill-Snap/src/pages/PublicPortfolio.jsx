import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function PublicPortfolio() {
  const { username } = useParams();

  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    axios
      .get(
        apiUrl(`/api/portfolio/${username}`)
      )
      .then((res) => {
        setPortfolio(res.data);
      })
      .catch(() => {
        setPortfolio(null);
      });
  }, [username]);

  if (!portfolio) {
    return <h2>Portfolio not found</h2>;
  }

  return (
    <div className="public-portfolio">
      <h1>{username}'s Portfolio</h1>

      <pre>{portfolio.aiContent}</pre>

      <div>
        {portfolio.projects.map((project) => (
          <div key={project.title}>
            <h3>{project.title}</h3>

            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
