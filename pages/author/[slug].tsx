import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { authors, blogArt, blogCover, getAuthor, postsByAuthor } from '../../lib/blog';
import { getArticle } from '../../lib/blogArticles';
import { Art } from '../../kit/components/Illustrations';
import {
  BOOK,
  Breadcrumbs,
  DcPage,
  LIME,
  LINE,
  MUTED,
  NOTE,
  Photo,
  SITE,
  TopicTag,
  card,
  h1Style,
  h2Style,
  h3Style,
} from '../../kit/components/DcPage';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: authors.map((a) => ({ params: { slug: a.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ slug: string }> = async ({ params }) => ({
  props: { slug: String(params?.slug) },
});

export default function AuthorPage({ slug }: InferGetStaticPropsType<typeof getStaticProps>) {
  const author = getAuthor(slug)!;
  const authorPosts = postsByAuthor(author.slug).filter((p) => getArticle(p.slug));
  const crumbs = [{ name: 'Blog', path: '/blog' }, { name: author.name }];
  const url = `${SITE}/author/${author.slug}`;
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    mainEntity: {
      '@type': 'Person',
      '@id': `${url}#person`,
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      image: `${SITE}${author.avatar}`,
      url,
      worksFor: { '@id': `${SITE}/#business` },
    },
  };

  return (
    <DcPage
      title={`${author.name} — ${author.role} | Phi Movers`}
      description={author.bio}
      path={`/author/${author.slug}`}
      crumbs={crumbs}
      schema={[personSchema]}
    >
      <section style={{ padding: 'clamp(26px,4vw,48px) 5vw 0' }}>
        <Breadcrumbs crumbs={crumbs} />
        <header style={{ ...card(false, 'clamp(20px,3vw,32px)'), display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <img src={author.avatar} alt={author.name} width={96} height={96} style={{ width: 96, height: 96, borderRadius: 24, objectFit: 'cover', flex: 'none', background: LIME }} />
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <TopicTag>{author.role}</TopicTag>
            <h1 style={{ ...h1Style('none', 'clamp(30px,3.8vw,44px)'), lineHeight: 1.08, margin: '0 0 12px' }}>{author.name}</h1>
            <p style={{ margin: '0 0 16px', maxWidth: '62ch', fontSize: 16, lineHeight: 1.6, color: MUTED }}>{author.bio}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 22px', fontSize: 14.5, color: NOTE }}>
              <span>{authorPosts.length} articles</span>
              <span>All 32 London boroughs</span>
              <a href={BOOK} className="dc-btn dc-btn-lime dc-btn-mark" style={{ fontSize: 15, padding: '11px 18px' }}>Get a quote</a>
            </div>
          </div>
        </header>
      </section>

      <section style={{ padding: 'clamp(34px,5vw,60px) 5vw' }}>
        <h2 className="dc-text" style={h2Style('0 0 20px', 'clamp(22px,2.4vw,30px)')}>Articles by {author.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {authorPosts.map((p) => (
            <article key={p.slug} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <a href={`/blog/${p.slug}`} tabIndex={-1} aria-hidden="true" style={{ display: 'block', aspectRatio: '5/3', overflow: 'hidden', background: '#e9e8e2' }}>
                {blogCover(p) ? <Photo src={blogCover(p)} alt="" /> : <Art subject={blogArt(p)} style="line" />}
              </a>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <TopicTag>{p.category} · {p.readMins} min read</TopicTag>
                <h3 className="dc-card-title" style={{ ...h3Style(18, '0 0 8px'), lineHeight: 1.25 }}><a href={`/blog/${p.slug}`}>{p.title}</a></h3>
                <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.5, color: MUTED, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{p.excerpt}</p>
                <a href={`/blog/${p.slug}`} className="dc-inline-link" style={{ marginTop: 'auto', fontSize: 14.5, fontWeight: 600 }}>Read article</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DcPage>
  );
}
