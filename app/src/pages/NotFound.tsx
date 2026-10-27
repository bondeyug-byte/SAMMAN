import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page wrap">
      <div className="state-panel">
        <h1>Page not found</h1>
        <p>This page doesn’t exist in the prototype.</p>
        <div className="btn-row">
          <Link className="btn" to="/">
            Go to the start
          </Link>
          <Link className="btn btn-quiet" to="/questions-support">
            Support information
          </Link>
        </div>
      </div>
    </div>
  );
}
