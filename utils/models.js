import tamiyaTT02 from '~/data/models/tamiya-tt-02.json'

// 所有可用车型数据
export const availableModels = [tamiyaTT02]

/**
 * 模糊搜索车型
 * @param {string} query - 搜索关键词
 * @returns {Array} 匹配的车型列表
 */
export function searchModels(query) {
  if (!query || query.trim() === '') {
    return []
  }
  
  const normalizedQuery = query.toLowerCase().trim()
  
  return availableModels.map(model => ({
    ...model,
    fullName: `${model.brand} ${model.name} ${model.type} ${model.scale}`
  })).filter(model => {
    // 多种匹配方式
    const searchTexts = [
      model.name.toLowerCase(),
      model.brand.toLowerCase(),
      model.fullName.toLowerCase(),
      model.id.toLowerCase(),
      `${model.brand} ${model.name}`.toLowerCase(),
      `${model.name} ${model.brand}`.toLowerCase()
    ]
    
    // 检查是否包含搜索关键词
    return searchTexts.some(text => text.includes(normalizedQuery))
  })
}

/**
 * 获取所有车型的简化信息（用于车型列表页面）
 * @returns {Array} 车型基本信息列表
 */
export function getAllModelsBasicInfo() {
  return availableModels.map(model => ({
    id: model.id,
    brand: model.brand,
    name: model.name,
    fullName: model.fullName,
    type: model.type,
    scale: model.scale,
    driveType: model.driveType,
    popularity: model.popularity,
    images: model.images
  }))
}

/**
 * 根据车型ID获取车型数据
 * @param {string} modelId - 车型ID
 * @returns {Object|null} 车型数据或null
 */
export function getModelById(modelId) {
  return availableModels.find(model => model.id === modelId) || null
}