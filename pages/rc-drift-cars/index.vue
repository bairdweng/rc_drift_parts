<template>
  <div class="rc-drift-cars-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">RC Drift Cars - Complete Guide to Professional Drifting</h1>
          <p class="hero-description">
            Discover everything about RC drift cars - from beginner setups to professional competition builds. 
            Learn about the best models, essential parts, and expert tuning techniques for perfect drifting.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">9,900</span>
              <span class="stat-label">Monthly Searches</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">21</span>
              <span class="stat-label">Competition Level</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">100+</span>
              <span class="stat-label">Expert Guides</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Models Section -->
    <section class="models-section">
      <div class="container">
        <h2 class="section-title">Popular RC Drift Car Models</h2>
        <div class="models-grid">
          <div class="model-card">
            <div class="model-image">
              <img src="/images/models/tamiya-tt-02.jpg" alt="Tamiya TT-02 RC Drift Car" />
            </div>
            <div class="model-content">
              <h3>Tamiya TT-02</h3>
              <p class="model-description">Perfect beginner RC drift car with excellent upgrade potential and wide parts availability.</p>
              <div class="model-specs">
                <span class="spec">Scale: 1/10</span>
                <span class="spec">Skill: Beginner</span>
                <span class="spec">Price: $150-250</span>
              </div>
            </div>
          </div>
          
          <div class="model-card">
            <div class="model-image">
              <img src="/images/models/yokomo-yd2.jpg" alt="Yokomo YD-2 RC Drift Car" />
            </div>
            <div class="model-content">
              <h3>Yokomo YD-2</h3>
              <p class="model-description">Professional competition chassis with advanced suspension geometry and precise handling.</p>
              <div class="model-specs">
                <span class="spec">Scale: 1/10</span>
                <span class="spec">Skill: Advanced</span>
                <span class="spec">Price: $300-500</span>
              </div>
            </div>
          </div>
          
          <div class="model-card">
            <div class="model-image">
              <img src="/images/models/mst-rmx.jpg" alt="MST RMX 2.0 RC Drift Car" />
            </div>
            <div class="model-content">
              <h3>MST RMX 2.0</h3>
              <p class="model-description">Versatile drift platform with excellent parts support and easy maintenance.</p>
              <div class="model-specs">
                <span class="spec">Scale: 1/10</span>
                <span class="spec">Skill: Intermediate</span>
                <span class="spec">Price: $250-400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Guides Section -->
    <section class="guides-section">
      <div class="container">
        <h2 class="section-title">Essential RC Drift Car Guides</h2>
        <div class="guides-grid">
          <nuxt-link to="/tech-articles/battery-systems-guide" class="guide-card">
            <div class="guide-icon">⚡</div>
            <h3>Battery Systems</h3>
            <p>Complete guide to powering your RC drift car with optimal battery selection and maintenance.</p>
            <span class="guide-link">Read Guide →</span>
          </nuxt-link>
          
          <nuxt-link to="/tech-articles/electronics-tuning-guide" class="guide-card">
            <div class="guide-icon">🔧</div>
            <h3>Electronics Tuning</h3>
            <p>Master ESC, motor, and gyro settings for perfect drift control and performance.</p>
            <span class="guide-link">Read Guide →</span>
          </nuxt-link>
          
          <nuxt-link to="/tech-articles/suspension-tire-setup" class="guide-card">
            <div class="guide-icon">🚗</div>
            <h3>Suspension & Tires</h3>
            <p>Learn about camber, toe, spring rates, and tire compounds for optimal drift performance.</p>
            <span class="guide-link">Read Guide →</span>
          </nuxt-link>
          
          <nuxt-link to="/tech-articles/transmitter-setup-guide" class="guide-card">
            <div class="guide-icon">🎮</div>
            <h3>Transmitter Setup</h3>
            <p>Configure your transmitter for precise control and perfect drifting techniques.</p>
            <span class="guide-link">Read Guide →</span>
          </nuxt-link>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions About RC Drift Cars</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h3>What is the best RC drift car for beginners?</h3>
            <p>The Tamiya TT-02 is highly recommended for beginners due to its affordable price, easy assembly, and excellent upgrade potential. It provides a solid foundation for learning drifting techniques.</p>
          </div>
          
          <div class="faq-item">
            <h3>How much does a complete RC drift car setup cost?</h3>
            <p>A complete beginner setup typically costs $200-400, including the car, transmitter, battery, and charger. Professional competition setups can range from $800 to $2000+.</p>
          </div>
          
          <div class="faq-item">
            <h3>What surfaces are best for RC drifting?</h3>
            <p>Smooth surfaces like polished concrete, PVC flooring, and specialized drift carpets work best. Avoid rough asphalt and gravel surfaces that can damage components.</p>
          </div>
          
          <div class="faq-item">
            <h3>Do I need a gyro for RC drifting?</h3>
            <p>While not strictly necessary, a gyro greatly improves stability and makes learning drifting much easier. Most serious drifters use gyros for consistent performance.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start Your RC Drift Journey?</h2>
          <p>Join thousands of enthusiasts who have mastered the art of RC drifting with our expert guides and professional parts.</p>
          <div class="cta-buttons">
            <nuxt-link to="/tech-articles" class="cta-button primary">Browse All Guides</nuxt-link>
            <nuxt-link to="/products" class="cta-button secondary">Shop Parts</nuxt-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'RC Drift Cars - Professional Parts & Setup Guides | rcdriftparts.com',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Complete guide to RC drift cars - learn about the best models, essential parts, and expert tuning techniques. Perfect for beginners and professional drifters alike.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'rc drift cars, RC drift car parts, drift car setup, professional drifting, Tamiya TT-02, Yokomo YD-2, MST RMX'
        },
        {
          property: 'og:title',
          content: 'RC Drift Cars - Professional Parts & Setup Guides'
        },
        {
          property: 'og:description',
          content: 'Complete guide to RC drift cars with expert tuning techniques and professional parts recommendations.'
        },
        {
          property: 'og:type',
          content: 'website'
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'RC Drift Cars - Professional Parts & Setup Guides',
            'description': 'Complete guide to RC drift cars with expert tuning techniques and professional parts recommendations.',
            'publisher': {
              '@type': 'Organization',
              'name': 'RC Drift Parts',
              'logo': {
                '@type': 'ImageObject',
                'url': '/logo.png'
              }
            },
            'mainEntity': {
              '@type': 'FAQPage',
              'mainEntity': [
                {
                  '@type': 'Question',
                  'name': 'What is the best RC drift car for beginners?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'The Tamiya TT-02 is highly recommended for beginners due to its affordable price, easy assembly, and excellent upgrade potential.'
                  }
                },
                {
                  '@type': 'Question',
                  'name': 'How much does a complete RC drift car setup cost?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'A complete beginner setup typically costs $200-400, including the car, transmitter, battery, and charger.'
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
.rc-drift-cars-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0 60px;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.3rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Models Section */
.models-section {
  padding: 80px 0;
  background: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: #2d3748;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.model-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.model-card:hover {
  transform: translateY(-5px);
}

.model-image {
  height: 200px;
  overflow: hidden;
}

.model-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.model-content {
  padding: 25px;
}

.model-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2d3748;
}

.model-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 15px;
}

.model-specs {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.spec {
  background: #edf2f7;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #4a5568;
}

/* Guides Section */
.guides-section {
  padding: 80px 0;
  background: #f7fafc;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.guide-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.guide-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.guide-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.guide-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2d3748;
}

.guide-card p {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 15px;
}

.guide-link {
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
}

/* FAQ Section */
.faq-section {
  padding: 80px 0;
  background: white;
}

.faq-grid {
  display: grid;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: #f7fafc;
  padding: 25px;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.faq-item h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2d3748;
}

.faq-item p {
  color: #718096;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 15px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.cta-button.primary {
  background: white;
  color: #667eea;
}

.cta-button.primary:hover {
  background: #f7fafc;
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.cta-button.secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .models-grid {
    grid-template-columns: 1fr;
  }
  
  .guides-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .hero-section {
    padding: 60px 0 40px;
  }
  
  .models-section,
  .guides-section,
  .faq-section,
  .cta-section {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>