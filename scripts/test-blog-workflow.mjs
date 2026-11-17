/**
 * End-to-end blog workflow test against local backend + MongoDB.
 * Cleans up the temporary test post afterward.
 */
const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:4000';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log('1) Health check…');
  const health = await fetch(`${BACKEND}/api/health`);
  assert(health.ok, 'Backend health failed');

  console.log('2) Admin login…');
  const loginRes = await fetch(`${BACKEND}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginJson = await loginRes.json();
  assert(loginRes.ok && loginJson.success, `Login failed: ${loginJson.message}`);
  const cookie = loginRes.headers.getSetCookie?.()?.join('; ') || loginRes.headers.get('set-cookie');
  assert(cookie, 'No auth cookie returned');

  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: cookie,
  };

  const slug = `workflow-test-${Date.now()}`;
  const draftPayload = {
    title: 'Workflow Test Blog Post for DESI SIGNS',
    slug,
    shortDescription: 'Temporary draft used to verify admin publish workflow end to end.',
    content:
      '<h2>Test Heading</h2><p>This is a <strong>temporary</strong> workflow verification article with enough content.</p><ul><li>Item one</li><li>Item two</li></ul>',
    author: 'QA Bot',
    authorRole: 'Tester',
    category: 'Sign Design Tips',
    tags: ['test', 'workflow'],
    publishedDate: new Date().toISOString().split('T')[0],
    readTime: '2 min read',
    image: '',
    imageAlt: '',
    metaTitle: 'Workflow Test Meta Title',
    metaDescription: 'Workflow test meta description for SEO verification.',
    focusKeyword: 'workflow test',
    canonicalUrl: '',
    published: false,
  };

  console.log('3) Create draft…');
  const createRes = await fetch(`${BACKEND}/api/admin/blogs`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(draftPayload),
  });
  const createJson = await createRes.json();
  assert(createRes.ok && createJson.success, `Create failed: ${JSON.stringify(createJson)}`);
  const id = createJson.data.id;
  console.log('   created id', id);

  console.log('4) Confirm draft is NOT in public list…');
  const publicList1 = await fetch(`${BACKEND}/api/blogs?limit=50`);
  const publicList1Json = await publicList1.json();
  assert(
    !publicList1Json.data?.some((b) => b.slug === slug),
    'Draft incorrectly visible in public list',
  );

  console.log('5) Confirm draft slug returns 404 publicly…');
  const publicDetail1 = await fetch(`${BACKEND}/api/blogs/${slug}`);
  assert(publicDetail1.status === 404, 'Draft slug should 404 publicly');

  console.log('6) Publish draft…');
  const publishRes = await fetch(`${BACKEND}/api/admin/blogs/${id}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      ...createJson.data,
      id,
      published: true,
      title: 'Workflow Test Blog Post for DESI SIGNS (Updated)',
      shortDescription: 'Updated excerpt after publish for verification.',
      content: createJson.data.content,
    }),
  });
  const publishJson = await publishRes.json();
  assert(publishRes.ok && publishJson.success, `Publish failed: ${JSON.stringify(publishJson)}`);
  assert(publishJson.data.published === true, 'Published flag not set');
  assert(
    publishJson.data.title.includes('Updated'),
    'Title update not saved',
  );

  console.log('7) Confirm published post is public…');
  const publicList2 = await fetch(`${BACKEND}/api/blogs?limit=50`);
  const publicList2Json = await publicList2.json();
  assert(
    publicList2Json.data?.some((b) => b.slug === slug),
    'Published post missing from public list',
  );

  const publicDetail2 = await fetch(`${BACKEND}/api/blogs/${slug}`);
  const publicDetail2Json = await publicDetail2.json();
  assert(publicDetail2.ok && publicDetail2Json.success, 'Published detail failed');
  assert(publicDetail2Json.data.title.includes('Updated'), 'Public detail not updated');

  console.log('8) Category filter…');
  const catRes = await fetch(
    `${BACKEND}/api/blogs?category=${encodeURIComponent('Sign Design Tips')}&limit=50`,
  );
  const catJson = await catRes.json();
  assert(catJson.data?.some((b) => b.slug === slug), 'Category filter missed published post');

  console.log('9) Unpublish…');
  const unpublishRes = await fetch(`${BACKEND}/api/admin/blogs/${id}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ ...publishJson.data, id, published: false }),
  });
  const unpublishJson = await unpublishRes.json();
  assert(unpublishRes.ok && unpublishJson.success, 'Unpublish failed');

  const publicList3 = await fetch(`${BACKEND}/api/blogs?limit=50`);
  const publicList3Json = await publicList3.json();
  assert(
    !publicList3Json.data?.some((b) => b.slug === slug),
    'Unpublished post still public',
  );
  const publicDetail3 = await fetch(`${BACKEND}/api/blogs/${slug}`);
  assert(publicDetail3.status === 404, 'Unpublished slug should 404');

  console.log('10) Unauthorized write blocked…');
  const unauth = await fetch(`${BACKEND}/api/admin/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draftPayload),
  });
  assert(unauth.status === 401, 'Unauthorized create should be 401');

  console.log('11) Cleanup test post…');
  const delRes = await fetch(`${BACKEND}/api/admin/blogs/${id}`, {
    method: 'DELETE',
    headers: { Cookie: cookie },
  });
  const delJson = await delRes.json();
  assert(delRes.ok && delJson.success, 'Cleanup delete failed');

  console.log('\n✅ Full blog workflow test passed.');
}

main().catch((err) => {
  console.error('\n❌ Workflow test failed:', err.message);
  process.exit(1);
});
