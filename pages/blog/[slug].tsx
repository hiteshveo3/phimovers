import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { authors, blogArt, blogCover, getPost, posts, relatedPagesFor, relatedPosts } from '../../lib/blog';
import { getArticle } from '../../lib/blogArticles';
import { businessRef } from '../../lib/seo';
import { bookHref } from '../../kit/estimate';
import { Art } from '../../kit/components/Illustrations';
import {
  Breadcrumbs,
  CtaBand,
  DcPage,
  LIME,
  LINE,
  MUTED,
  NOTE,
  Photo,
  RelatedPages,
  SITE,
  SideCard,
  TopicTag,
  card,
  h1Style,
  h2Style,
  h3Style,
  monoLabel,
} from '../../kit/components/DcPage';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: posts.filter((p) => getArticle(p.slug)).map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

// Reading time from the article's own word count (about 220 words a minute), worked out at build time.
export const getStaticProps: GetStaticProps<{ slug: string; readMins: number }> = async ({ params }) => {
  const slug = String(params?.slug);
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(<>{getArticle(slug)?.body}</>);
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return { props: { slug, readMins: Math.max(1, Math.round(wordCount / 220)) } };
};

const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function BlogPostPage({ slug, readMins }: InferGetStaticPropsType<typeof getStaticProps>) {
  const post = getPost(slug)!;
  const article = getArticle(slug)!;
  const author = authors[0];
  const url = `${SITE}/blog/${post.slug}`;
  const cover = blogCover(post);
  const related = relatedPosts(post.slug);
  const categoryPath = `/blog?topic=${encodeURIComponent(post.category)}`;
  const crumbs = [{ name: 'Blog', path: '/blog' }, { name: post.category, path: categoryPath }, { name: post.title }];
  const modified = post.updated ?? post.date;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    ...(cover ? { image: [`${SITE}${cover}`] } : {}),
    datePublished: post.date,
    dateModified: modified,
    author: { '@type': 'Person', name: author.name, url: `${SITE}/author/${author.slug}` },
    publisher: businessRef(),
    mainEntityOfPage: { '@id': `${url}#webpage` },
    articleSection: post.category,
  };

  return (
    <DcPage
      title={`${post.title} | Phi Movers`}
      description={post.excerpt}
      path={`/blog/${post.slug}`}
      crumbs={crumbs}
      ogImage={cover || undefined}
      ogType="article"
      published={post.date}
      modified={modified}
      schema={[articleSchema]}
    >
      <article style={{ padding: 'clamp(26px,4vw,48px) 5vw 0' }}>
        <Breadcrumbs crumbs={crumbs} />

        <div style={{ maxWidth: 760 }}>
          <TopicTag>{post.category}</TopicTag>
          <h1 style={{ ...h1Style('none', 'clamp(32px,4.4vw,50px)'), lineHeight: 1.05, margin: '0 0 18px' }}>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingBottom: 22, borderBottom: '1px solid rgba(15,26,9,.12)' }}>
            <img src={author.avatar} alt={author.name} width={44} height={44} style={{ width: 44, height: 44, borderRadius: 999, objectFit: 'cover', flex: 'none', background: LIME }} />
            <span style={{ fontSize: 14, lineHeight: 1.4 }}>
              <a href={`/author/${author.slug}`} rel="author" className="dc-inline-link" style={{ fontWeight: 600 }}>{author.name}</a>
              <span style={{ display: 'block', color: NOTE, fontSize: 13 }}>
                Published <time dateTime={post.date}>{post.dateLabel}</time>
                {post.updated && post.updated !== post.date && <> · Updated <time dateTime={post.updated}>{longDate(post.updated)}</time></>}
                {' '}· {readMins} min read
              </span>
            </span>
          </div>
        </div>

        <div style={{ aspectRatio: '2/1', margin: '26px 0 34px', borderRadius: 20, border: '1px solid rgba(15,26,9,.14)', overflow: 'hidden', background: 'var(--band-a)' }}>
          {cover ? <Photo src={cover} alt={post.title} eager /> : <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}><div style={{ width: 'min(520px,90%)' }}><Art subject={blogArt(post)} style="line" label={`${post.category} illustration`} /></div></div>}
        </div>

        <div className="dc-two-col" style={{ justifyContent: 'start' }}>
          <div className="dc-prose" style={{ minWidth: 0 }}>
            {article.body}

            <div style={{ ...card(), display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap', margin: '34px 0 0' }}>
              <img src={author.avatar} alt={author.name} width={72} height={72} loading="lazy" decoding="async" style={{ width: 72, height: 72, borderRadius: 999, objectFit: 'cover', flex: 'none', background: LIME }} />
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <p style={monoLabel('0 0 6px')}>About the author</p>
                <p style={h3Style(19, '0 0 2px')}><a href={`/author/${author.slug}`} rel="author">{author.name}</a></p>
                <p style={{ margin: '0 0 10px', fontSize: 14, color: NOTE }}>{author.role}</p>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: MUTED }}>{author.bio}</p>
              </div>
            </div>
          </div>

          <aside className="dc-aside">
            <nav aria-label="On this page" style={card()}>
              <p style={monoLabel()}>On this page</p>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 2 }}>
                {article.toc.map((t) => (
                  <span key={t.id} style={{ display: 'block' }}><a href={`#${t.id}`}>{t.label}</a></span>
                ))}
              </p>
            </nav>
            <SideCard title="Moving soon? Start your free quote in under a minute." text="Fixed prices · All 32 London boroughs" book={bookHref()} />
          </aside>
        </div>
      </article>

      <RelatedPages items={relatedPagesFor(post)} />

      <section style={{ padding: 'clamp(34px,5vw,60px) 5vw' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, margin: '0 0 20px' }}>
          <h2 className="dc-text" style={h2Style('0', 'clamp(22px,2.4vw,30px)')}>More from the blog</h2>
          <a href="/blog" className="dc-inline-link" style={{ fontSize: 14.5, fontWeight: 600 }}>View all</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {related.map((p) => {
            const c = blogCover(p);
            return (
              <article key={p.slug} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, overflow: 'hidden' }}>
                <a href={`/blog/${p.slug}`} tabIndex={-1} aria-hidden="true" style={{ display: 'block', aspectRatio: '5/3', overflow: 'hidden', background: 'var(--band-a)' }}>
                  {c ? <Photo src={c} alt="" /> : <Art subject={blogArt(p)} style="line" />}
                </a>
                <div style={{ padding: 18 }}>
                  <TopicTag>{p.category}</TopicTag>
                  <h3 className="dc-card-title" style={{ ...h3Style(18, '0'), lineHeight: 1.25 }}><a href={`/blog/${p.slug}`}>{p.title}</a></h3>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand title="Moving soon? Start your free quote in under a minute." text="Fixed prices · All 32 London boroughs" book={bookHref()} />
    </DcPage>
  );
}
