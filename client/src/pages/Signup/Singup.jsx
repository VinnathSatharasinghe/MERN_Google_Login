import './Singup.css';
const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to My Website</h1>
        <p>Your one-stop solution for all things web development!</p>
      </header>
      
      <main className="home-content">
        <section className="home-section">
          <h2>About Us</h2>
          <p>We provide top-notch web development services, specializing in React and the MERN stack.</p>
        </section>
        <section className="home-section">
          <h2>Our Services</h2>
          <ul>
            <li>Full-stack development</li>
            <li>UI/UX Design</li>
            <li>API Integration</li>
            <li>Responsive Web Design</li>
          </ul>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 My Website. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
