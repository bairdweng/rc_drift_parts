<template>
  <div class="parts-index-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <a href="/" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">All RC Drift Models</span>
    </nav>

    <!-- Page Header -->
    <header class="page-header">
      <h1 class="page-title">RC Drift Car Models</h1>
      <p class="page-description">
        Browse our collection of RC drift car models. Each model has detailed parts information,
        compatibility guides, and installation instructions.
      </p>
    </header>

    <!-- Models Grid -->
    <main class="models-grid-section">
      <div class="models-container">
        <div 
          v-for="model in models" 
          :key="model.id"
          class="model-card"
        >
          <div class="model-image">
            <div class="image-placeholder">
              🚗
            </div>
          </div>
          
          <div class="model-content">
            <h2 class="model-name">{{ model.fullName }}</h2>
            <p class="model-description">{{ model.description }}</p>
            
            <div class="model-specs">
              <div class="spec-item">
                <span class="spec-label">Brand:</span>
                <span class="spec-value">{{ model.brand }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Scale:</span>
                <span class="spec-value">{{ model.scale }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Drive:</span>
                <span class="spec-value">{{ model.driveType }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Popularity:</span>
                <span class="spec-value">{{ model.popularity }}%</span>
              </div>
            </div>
            
            <div class="model-actions">
              <nuxt-link 
                :to="`/parts/${model.id}`" 
                class="view-parts-btn"
              >
                Browse Parts
              </nuxt-link>
              <nuxt-link 
                :to="`/tech-articles/model/${model.id}`" 
                class="view-guides-btn"
              >
                View Guides
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Coming Soon Section -->
    <section class="coming-soon-section">
      <h2 class="section-title">More Models Coming Soon</h2>
      <p class="section-description">
        We're constantly adding new RC drift car models to our database. 
        Check back regularly for updates on popular models like Yokomo YD-2, MST RMX, and more.
      </p>
      
      <div class="coming-soon-grid">
        <div class="coming-soon-card">
          <div class="card-icon">🏎️</div>
          <h3>Yokomo YD-2</h3>
          <p>Professional competition chassis with advanced suspension geometry</p>
        </div>
        <div class="coming-soon-card">
          <div class="card-icon">🚙</div>
          <h3>MST RMX 2.0</h3>
          <p>Versatile drift platform with excellent parts support</p>
        </div>
        <div class="coming-soon-card">
          <div class="card-icon">🏁</div>
          <h3>Overdose Galm</h3>
          <p>High-end competition chassis for professional drifters</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData() {
    try {
      // Load all available models
      const models = []
      
      // Load Tamiya TT-02 model data
      const tamiyaData = await import('~/data/models/tamiya-tt-02.json')
      models.push(tamiyaData.default || tamiyaData)
      
      return {
        models
      }
    } catch (error) {
      console.error('Error loading models data:', error)
      return {
        models: []
      }
    }
  },
  
  head() {
    return {
      title: 'RC Drift Car Models - Browse All Available Models | rcdriftparts.com',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Browse our complete collection of RC drift car models. Find detailed parts information, compatibility guides, and installation instructions for each model.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'RC drift car models, Tamiya TT-02, Yokomo YD-2, MST RMX, drift car parts, RC model comparison'
        },
        {
          property: 'og:title',
          content: 'RC Drift Car Models - Browse All Available Models'
        },
        {
          property: 'og:description',
          content: 'Complete collection of RC drift car models with detailed parts information and compatibility guides.'
        },
        {
          property: 'og:type',
          content: 'website'
        }
      ]
    }
  }
}
</script>

<style scoped>
.parts-index-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 60px;
}

/* Breadcrumb */
.breadcrumb {
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #6c757d;
}

.breadcrumb-current {
  color: #495057;
  font-weight: 500;
}

/* Page Header */
.page-header {
  background: white;
  padding: 60px 0;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.page-description {
  font-size: 1.2rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Models Grid */
.models-grid-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.models-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin: 60px 0;
}

.model-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.model-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.model-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 4rem;
  color: white;
}

.model-content {
  padding: 30px;
}

.model-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.model-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.model-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.spec-label {
  font-weight: 500;
  color: #495057;
}

.spec-value {
  color: #6c757d;
}

.model-actions {
  display: flex;
  gap: 12px;
}

.view-parts-btn, .view-guides-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-parts-btn {
  background: #007bff;
  color: white;
}

.view-parts-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.view-guides-btn {
  background: #6c757d;
  color: white;
}

.view-guides-btn:hover {
  background: #545b62;
  transform: translateY(-1px);
}

/* Coming Soon Section */
.coming-soon-section {
  background: white;
  padding: 60px 20px;
  margin-top: 60px;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.1rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.coming-soon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.coming-soon-card {
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.coming-soon-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.coming-soon-card p {
  color: #718096;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .models-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
  
  .model-specs {
    grid-template-columns: 1fr;
  }
  
  .model-actions {
    flex-direction: column;
  }
  
  .coming-soon-grid {
    grid-template-columns: 1fr;
  }
}
</style>