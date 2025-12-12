// 性能优化插件 - Nuxt 4 兼容格式
export default defineNuxtPlugin((nuxtApp) => {
  // 预加载关键资源
  if (process.client) {
    // 预加载关键字体
    const preloadFonts = [
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
    ]
    
    preloadFonts.forEach(fontUrl => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = fontUrl
      link.as = 'style'
      document.head.appendChild(link)
    })
    
    // 延迟加载非关键资源
    window.addEventListener('load', () => {
      // 延迟加载Google Analytics
      const gaScript = document.createElement('script')
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-KGTL7ESMEK'
      gaScript.async = true
      document.head.appendChild(gaScript)
    })
  }
  
  // 提供性能优化方法
  return {
    provide: {
      performance: {
        // 图片懒加载
        lazyLoadImages: () => {
          if (process.client) {
            const images = document.querySelectorAll('img[data-src]')
            const imageObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const img = entry.target
                  img.src = img.dataset.src
                  img.removeAttribute('data-src')
                  observer.unobserve(img)
                }
              })
            })
            
            images.forEach(img => imageObserver.observe(img))
          }
        },
        
        // 预加载关键页面
        preloadCriticalPages: () => {
          if (process.client) {
            const criticalPages = ['/models', '/parts/tamiya-tt-02', '/tech-articles']
            criticalPages.forEach(page => {
              const link = document.createElement('link')
              link.rel = 'prefetch'
              link.href = page
              document.head.appendChild(link)
            })
          }
        }
      }
    }
  }
})