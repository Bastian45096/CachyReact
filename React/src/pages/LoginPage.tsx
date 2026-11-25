import LoginCard from '../components/LoginCard';
import '../styles/LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="aurora">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="grid-bg" />
      <div className="vignette" />
      <LoginCard />
    </div>
  );
}