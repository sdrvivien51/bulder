import axios from 'axios';

const NOCODB_API_URL = process.env.NEXT_PUBLIC_NOCODB_API_URL || 'https://app.nocodb.com/api/v2';
const NOCODB_API_TOKEN = process.env.NEXT_PUBLIC_NOCODB_API_TOKEN;
const TABLE_ID = process.env.NEXT_PUBLIC_TABLE_ID;
const VIEW_ID = process.env.NEXT_PUBLIC_VIEW_ID;

// Configuration Axios
const nocodbClient = axios.create({
  baseURL: NOCODB_API_URL,
  headers: {
    'xc-token': NOCODB_API_TOKEN
  }
});

export interface Tool {
  Id: string;
  name: string;
  rating: number;
  tagline: string;
  description: string;
  advantage: string[];
  inconvenient: string[];
  website: string;
  image: string[] | null;
  logo: string | null;
  FAQ: Array<{
    question: string;
    answer: string;
  }>;
  categories: string;
  pricing: string;
  slug: string;
  youtube_url?: string[];
  source_url?: string[];
  banner_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  content: string;
  slug: string;
  banner_url: string;
  category: string;
  date?: string;
  title: string;
  faq: string[];
  strucured_schema: string[];
  created_at?: string;
}

interface ImageData {
  url: string;
  title: string;
  mimetype: string;
  size: number;
  width: number;
  height: number;
  id: string;
}

export async function getTools(): Promise<Tool[]> {
  try {
    const response = await nocodbClient.get(`/tables/${TABLE_ID}/records`, {
      params: {
        offset: 0,
        limit: 25,
        where: '',
        viewId: VIEW_ID
      }
    });
    
    return response.data.list;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw new Error('Failed to fetch tools');
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  try {
    const response = await nocodbClient.get(`/tables/${TABLE_ID}/records`, {
      params: {
        where: `(slug,eq,${slug})`,
        viewId: VIEW_ID
      }
    });

    return response.data.list[0] || null;
  } catch (error) {
    console.error('Error fetching tool:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
    }
    throw new Error('Failed to fetch tool');
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_NOCODB_API_URL}/tables/mvypt0ig10og8q5/records`,
      {
        params: {
          where: `(slug,eq,${slug})`,
          limit: 1,
          viewId: 'vw47ugso5z4n35pr',
        },
        headers: {
          'xc-token': process.env.NEXT_PUBLIC_NOCODB_API_TOKEN
        }
      }
    );

    const post = response.data.list[0];
    if (!post) return null;

    // Utilisation directe de l'URL
    return {
      title: post.Title,
      content: post.content,
      coverImage: post.banner_url || '/images/default-banner.jpg',
      category: post.categorie,
      slug: post.slug,
    };
  } catch (error) {
    console.error('Error details:', error);
    return null;
  }
}

export async function getAllBlogPosts() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_NOCODB_API_URL}/tables/mvypt0ig10og8q5/records`,
      {
        params: {
          limit: 100,
          viewId: 'vw47ugso5z4n35pr',
        },
        headers: {
          'xc-token': process.env.NEXT_PUBLIC_NOCODB_API_TOKEN
        }
      }
    );

    return response.data.list.map((post: BlogPost) => {
      // Gestion améliorée de l'URL de l'image
      let banner_url = post.banner_url || '/default-banner.jpg';
      
      // Si banner_url est une chaîne JSON, on essaie de la parser
      if (typeof banner_url === 'string' && banner_url.startsWith('[')) {
        try {
          const parsedImages = JSON.parse(banner_url) as ImageData[];
          if (parsedImages && parsedImages.length > 0) {
            banner_url = parsedImages[0].url;
          }
        } catch (e) {
          console.error('Error parsing banner_url:', e);
          banner_url = '/default-banner.jpg';
        }
      }

      return {
        title: post.title,
        content: post.content,
        banner_url: banner_url, // Utilisation du banner_url traité
        category: post.category,
        slug: post.slug,
        date: post.created_at || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
} 