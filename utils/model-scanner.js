// Import model data directly since we can't use fs in browser
import tamiyaTT02 from '~/data/models/tamiya-tt-02.json'
// import yokomoYD2 from '~/data/models/yokomo-yd-2.json'
// import mstRMX20 from '~/data/models/mst-rmx-2.0.json'

/**
 * Model Scanner Utility
 * Returns all model data for the application
 */

export async function scanModels() {
  const models = [
    {
      ...tamiyaTT02,
      url: `/tech-articles/model/${tamiyaTT02.id}`
    },
    // {
    //   ...yokomoYD2,
    //   url: `/tech-articles/model/${yokomoYD2.id}`
    // },
    // {
    //   ...mstRMX20,
    //   url: `/tech-articles/model/${mstRMX20.id}`
    // }
  ]
  
  // Sort models by popularity (descending)
  models.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  
  return models
}

/**
 * Get a specific model by ID
 */
export async function getModelById(modelId) {
  const models = await scanModels()
  return models.find(model => model.id === modelId)
}

/**
 * Get models by brand
 */
export async function getModelsByBrand(brand) {
  const models = await scanModels()
  return models.filter(model => model.brand.toLowerCase() === brand.toLowerCase())
}

/**
 * Search models by name or brand
 */
export async function searchModels(query) {
  const models = await scanModels()
  const searchTerm = query.toLowerCase()
  
  return models.filter(model => 
    model.name.toLowerCase().includes(searchTerm) ||
    model.brand.toLowerCase().includes(searchTerm) ||
    model.fullName.toLowerCase().includes(searchTerm)
  )
}

/**
 * Get all available brands
 */
export async function getAvailableBrands() {
  const models = await scanModels()
  const brands = [...new Set(models.map(model => model.brand))]
  return brands.sort()
}

/**
 * Get models grouped by brand
 */
export async function getModelsGroupedByBrand() {
  const models = await scanModels()
  const grouped = {}
  
  models.forEach(model => {
    if (!grouped[model.brand]) {
      grouped[model.brand] = []
    }
    grouped[model.brand].push(model)
  })
  
  return grouped
}