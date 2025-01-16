import axios from 'axios';
import { z } from 'zod';

const NOCODB_API_URL = process.env.NEXT_PUBLIC_NOCODB_API_URL || 'https://app.nocodb.com/api/v2';
const NOCODB_API_TOKEN = process.env.NEXT_PUBLIC_NOCODB_API_TOKEN;
const BLOG_TABLE_ID = process.env.NEXT_PUBLIC_BLOG_TABLE_ID;
const TOOLS_TABLE_ID = process.env.NEXT_PUBLIC_TOOLS_TABLE_ID;
const VIEW_ID = process.env.NEXT_PUBLIC_VIEW_ID;

// Configuration Axios
const nocodbClient = axios.create({
  baseURL: NOCODB_API_URL,
  headers: {
    'xc-token': NOCODB_API_TOKEN
  }
});

// Définir le schéma Zod pour BlogPost
const BlogPostSchema = z.object({
  Title: z.string(),
  content: z.string(),
  banner_url: z.string(),
  categorie: z.string(),
  slug: z.string(),
  created_at: z.string().nullable().optional(),
  metadescription: z.string().optional(),
  FAQ: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  strucured_schema: z.array(z.string()).optional(),
  updated_at: z.string().nullable().optional()
});

export type BlogPostInput = z.infer<typeof BlogPostSchema>;

// Définir l'interface pour un élément FAQ
interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  title: string;
  content: string;
  banner_url: string;
  category: string;
  slug: string;
  date: string;
  metadescription: string;
  faq: FAQItem[];
  strucured_schema: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  banner_url: string;
  categories: string;
  date: string;
  features: string[];
  advantage: string[];
  inconvenient: string[];
  source_url?: string[];
  youtube_url?: string[];
  logo?: string;
  tagline?: string;
  rating?: number;
  slug: string;
  pricing?: string;
  website?: string;
  image?: string[];
  FAQ?: Array<{ question: string; answer: string; }>;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await nocodbClient.get(`/tables/${BLOG_TABLE_ID}/records`, {
      params: {
        where: `(slug,eq,${slug})`,
        viewId: VIEW_ID
      }
    });

    const post = response.data.list[0];
    if (!post) return null;

    const parsedPost = BlogPostSchema.safeParse(post);
    if (!parsedPost.success) {
      console.error('Validation Error:', parsedPost.error);
      return null;
    }

    const postData = parsedPost.data;

    return {
      title: postData.Title,
      content: postData.content,
      banner_url: postData.banner_url,
      category: postData.categorie,
      slug: postData.slug,
      date: postData.created_at || new Date().toISOString(),
      metadescription: postData.metadescription || '',
      faq: postData.FAQ || [],
      strucured_schema: postData.strucured_schema || [],
      created_at: postData.created_at || undefined,
      updated_at: postData.updated_at || undefined,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article de blog :', error);
    throw new Error('Échec de la récupération de l\'article de blog');
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    console.log('Fetching blog posts with:', {
      tableId: BLOG_TABLE_ID,
      viewId: VIEW_ID
    });

    const response = await nocodbClient.get(`/tables/${BLOG_TABLE_ID}/records`, {
      params: {
        limit: 100,
        viewId: VIEW_ID,
      }
    });

    console.log('Raw blog posts response:', response.data); // Debug log

    return response.data.list.map((postData: any) => {
      // Log des données brutes pour debug
      console.log('Raw post data:', postData);

      const parsedPost = BlogPostSchema.safeParse(postData);
      if (!parsedPost.success) {
        console.error('Validation Error:', parsedPost.error);
        return null;
      }

      const post = parsedPost.data;
      return {
        title: post.Title,
        content: post.content,
        banner_url: post.banner_url,
        category: post.categorie,
        slug: post.slug,
        date: post.created_at || new Date().toISOString(),
        metadescription: post.metadescription || '',
        faq: post.FAQ || [],
        strucured_schema: post.strucured_schema || [],
        created_at: post.created_at || undefined,
        updated_at: post.updated_at || undefined,
      };
    }).filter(Boolean) as BlogPost[];
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des articles:', error);
    console.error('Error details:', error);
    return [];
  }
}

export async function getTools(): Promise<Tool[]> {
  try {
    const response = await nocodbClient.get(`/tables/${TOOLS_TABLE_ID}/records`, {
      params: {
        limit: 100,
        viewId: VIEW_ID,
      }
    });

    console.log('Raw tools data:', response.data.list); // Debug log

    return response.data.list.map((tool: any) => {
      // Debug log pour chaque outil
      console.log('Processing tool:', {
        Id: tool.Id, // Vérifions si c'est 'Id' ou 'id'
        id: tool.id,
        Name: tool.Name,
        categories: tool.categories
      });

      return {
        id: tool.Id || tool.id, // Essayons les deux possibilités
        name: tool.Name || '',
        description: tool.description || '',
        banner_url: tool.banner_url || '',
        categories: tool.categories || '',
        date: tool.created_at || new Date().toISOString(),
        features: tool.features || [],
        advantage: Array.isArray(tool.advantage) ? tool.advantage : [],
        inconvenient: Array.isArray(tool.inconvenient) ? tool.inconvenient : [],
        source_url: Array.isArray(tool.source_url) ? tool.source_url : [],
        youtube_url: Array.isArray(tool.youtube_url) ? tool.youtube_url : [],
        logo: tool.logo || null,
        tagline: tool.tagline || '',
        rating: tool.rating || null,
        slug: tool.slug || '',
        pricing: tool.pricing || null,
        website: tool.website || null,
        image: Array.isArray(tool.image) ? tool.image : [],
        FAQ: Array.isArray(tool.FAQ) ? tool.FAQ : []
      };
    });
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des outils:', error);
    return [];
  }
}

// Fonction helper pour récupérer les alternatives
async function getAlternativeTools(currentTool: Tool): Promise<Tool[]> {
  try {
    const allTools = await getTools();
    console.log('Current tool:', {
      id: currentTool.id,
      categories: currentTool.categories
    });

    // Filtrer les alternatives
    const alternatives = allTools.filter(altTool => {
      // Debug pour chaque comparaison
      console.log('Comparing:', {
        currentToolId: currentTool.id,
        altToolId: altTool.id,
        currentCategory: currentTool.categories,
        altCategory: altTool.categories,
        areIdsEqual: altTool.id === currentTool.id,
        areCategoriesEqual: altTool.categories.toLowerCase() === currentTool.categories.toLowerCase()
      });

      return (
        altTool.id && // L'outil alternatif a un ID
        currentTool.id && // L'outil courant a un ID
        altTool.id !== currentTool.id && // IDs différents
        altTool.categories && // L'outil alternatif a une catégorie
        currentTool.categories && // L'outil courant a une catégorie
        altTool.categories.toLowerCase() === currentTool.categories.toLowerCase() // Même catégorie
      );
    });

    console.log('Found alternatives:', alternatives);
    return alternatives.slice(0, 3);
  } catch (error) {
    console.error('Error fetching alternative tools:', error);
    return [];
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  try {
    if (!TOOLS_TABLE_ID) {
      throw new Error('NEXT_PUBLIC_TOOLS_TABLE_ID n\'est pas défini dans les variables d\'environnement');
    }

    const response = await nocodbClient.get(`/tables/${TOOLS_TABLE_ID}/records`, {
      params: {
        limit: 1,
        viewId: VIEW_ID,
        where: `(slug,eq,${slug})`
      }
    });

    // Ajout de logs pour déboguer
    console.log('Raw NocoDB response:', response.data);
    console.log('First tool in response:', response.data.list[0]);

    if (!response.data.list || response.data.list.length === 0) {
      return null;
    }

    const tool = response.data.list[0];
    
    // Log pour déboguer
    console.log('Raw tool data:', tool);
    
    const transformedTool = {
      id: tool.id,
      name: tool.Name || '',
      description: tool.description || '',
      banner_url: tool.banner_url || '',
      categories: tool.categories || '',
      date: tool.created_at || new Date().toISOString(),
      features: tool.features || [],
      advantage: Array.isArray(tool.advantage) ? tool.advantage : [],
      inconvenient: Array.isArray(tool.inconvenient) ? tool.inconvenient : [],
      source_url: Array.isArray(tool.source_url) ? tool.source_url : [],
      youtube_url: Array.isArray(tool.youtube_url) ? tool.youtube_url : [],
      logo: tool.logo || '',
      tagline: tool.tagline || '',
      rating: tool.rating,
      slug: tool.slug || '',
      pricing: tool.pricing || '',
      website: tool.website || '',
      image: Array.isArray(tool.image) ? tool.image : [],
      FAQ: Array.isArray(tool.FAQ) ? tool.FAQ : []
    };

    // Log pour déboguer la transformation
    console.log('Transformed tool data:', transformedTool);

    return transformedTool;
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération de l\'outil par slug:', error);
    throw error;
  }
} 