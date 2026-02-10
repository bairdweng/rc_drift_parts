'use client'

import { useSearchParams } from 'next/navigation'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

export default function BlogPage() {
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get('tag')

  // 获取所有文章
  const allPosts = allCoreContent(sortPosts(allBlogs))

  // 根据标签过滤文章
  const filteredPosts = selectedTag
    ? allPosts.filter((post) => post.tags?.includes(selectedTag))
    : allPosts

  const pageNumber = 1
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  // 动态生成页面标题
  const getPageTitle = () => {
    if (selectedTag) {
      const tagTitles = {
        'beginner-guides': 'RC Drift Beginner Guides',
        'performance-upgrades': 'RC Drift Performance Upgrades',
        'electronics-tuning': 'RC Drift Electronics Tuning',
        'suspension-setup': 'RC Drift Suspension Setup',
        'maintenance-care': 'RC Drift Maintenance & Care',
      }
      return tagTitles[selectedTag as keyof typeof tagTitles] || `RC Drift Guides - ${selectedTag}`
    }
    return 'RC Drift Guides'
  }

  return (
    <ListLayoutWithTags
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={getPageTitle()}
    />
  )
}
