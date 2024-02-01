import "./About.css";
import img1 from '../../Assets/about-1.jpg';
import img2 from '../../Assets/about-2.jpg';
import img3 from '../../Assets/about-3.jpg';

function About(): JSX.Element {
    const content = [
        { title: `Explore Our Vision`, image: img1 },
        { title: `Our Commitment to Paradise`, image: img2 },
        { title: `Contact Us for Your Dream Getaway`, image: img3 }
    ];
    return (
        <div className="About">
            {content.map((item, index) => (
                <section key={index} className="section">
                    <figure className="image-container">
                        <img src={item.image} alt="" />
                    </figure>

                    <article className="content">
                        <h2 className="section-title">{item.title}</h2>

                        <span className="byline">
                            Discover more about us through <a href="#">our vacation paradise →</a>
                        </span>

                        <p>Embark on a journey with us and explore our vision of creating unforgettable vacation experiences. We are passionate about providing you with the perfect getaway, where every moment is filled with joy, relaxation, and adventure.</p>

                        <p>At our vacation paradise, we are committed to turning your dreams into reality. Whether it's lounging on pristine beaches, indulging in local cuisines, or embarking on thrilling excursions, we strive to make your vacation a seamless and blissful escape from the ordinary.</p>

                        <p>Contact us today, and let us help you plan your dream getaway. Our team is dedicated to ensuring that every detail of your vacation is carefully curated to exceed your expectations. We look forward to being a part of your journey to paradise!</p>
                    </article>
                </section>
            ))}
        </div>
    );
}

export default About;
