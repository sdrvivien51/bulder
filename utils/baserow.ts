const BASEROW_API_URL = process.env.BASEROW_API_URL;
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN;
const TABLE_ID = process.env.BASEROW_TABLE_ID;

export async function getArticles() {
  const response = await fetch(`${BASEROW_API_URL}/api/database/rows/table/${TABLE_ID}/?user_field_names=true`, {
    headers: {
      'Authorization': `Token ${BASEROW_API_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.results;
}

export async function getArticleBySlug(slug: string) {
  const response = await fetch(`${BASEROW_API_URL}/api/database/rows/table/${TABLE_ID}/?user_field_names=true&filter__field_slug__equal=${slug}`, {
    headers: {
      'Authorization': `Token ${BASEROW_API_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.results[0];
}

export async function getToolBySlug(slug: string) {
  const response = await fetch(`${BASEROW_API_URL}/api/database/rows/table/${TABLE_ID}/?filter[slug]=${slug}`, {
    headers: {
      'Authorization': `Token ${BASEROW_API_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.results[0]; // Assurez-vous de renvoyer le bon outil
}

