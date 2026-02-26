import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://pdfyai.com'

    const routes = [
        '',
        '/compress-pdf',
        '/jpg-to-pdf',
        '/merge-pdf',
        '/ocr',
        '/pdf-to-jpg',
        '/pdf-to-word',
        '/protect-pdf',
        '/rotate-pdf',
        '/split-pdf',
        '/unlock-pdf',
        '/watermark-pdf',
        '/word-to-pdf',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'yearly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))
}
