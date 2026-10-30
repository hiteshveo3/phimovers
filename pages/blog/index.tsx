import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { GetStaticProps } from 'next';
import { posts as allPosts, blogArt, blogCategories, blogCover, authors, type BlogPost } from '../../lib/blog';
import { getArticle } from '../../lib/blogArticles';
import { Art } from '../../kit/components/Illustrations';
import { Breadcrumbs, CtaBand, DcPage, Photo } from '../../kit/components/DcPage';
import { MOTION_CSS, Words, useHomeMotion } from '../../kit/components/HomeMotion';
import { Eyebrow, KIT_CSS, PkSearchClear, kitIcon } from '../../kit/components/PageKit';
import { ArrowRight as ArrowRightIcon, SearchNormal1 as SearchIcon } from 'iconsax-reactjs';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const TITLE = 'The Phi Movers blog';
const DESCRIPTION = 'Practical moving guides, packing tips and London removal advice from Phi Movers — covering all 32 boroughs.';
const PAGE = 6;
const author = authors[0];
// Only posts with a built article are listed, so no card leads to a 404.
const posts = allPosts.filter((p) => getArticle(p.slug));

// Reading time per post from the article word count, worked out at build time.
export const getStaticProps: GetStaticProps<{ mins: Record<string, number> }> = async () => {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const mins = Object.fromEntries(posts.map((p) => {
    const words = renderToStaticMarkup(<>{getArticle(p.slug)?.body}</>).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return [p.slug, Math.max(1, Math.round(words / 220))];
  }));
  return { props: { mins } };
};

function Cover({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  const c = blogCover(post);
  return c ? <Photo src={c} alt={post.title} eager={eager} /> : <Art subject={blogArt(post)} style="line" label={`${post.category} illustration`} />;
}

const GUIDES_CSS = `
.bg-feature{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(12px,2.4vw,32px);align-items:center;padding:6px;margin-top:clamp(24px,3vw,36px);color:inherit;transition:transform .35s var(--ease-soft),box-shadow .35s var(--ease-soft)}
.bg-feature:hover{transform:translateY(-3px);box-shadow:0 2px 4px rgba(15,26,9,.05),0 22px 40px -22px rgba(15,26,9,.32)}
.bg-feature-img{display:block;overflow:hidden;border-radius:15px;aspect-ratio:16/10;background:var(--grey)}
.bg-feature-img img{transition:transform .6s var(--ease-soft)}
.bg-feature:hover .bg-feature-img img{transform:scale(1.03)}
.bg-feature-body{display:grid;gap:12px;justify-items:start;padding:clamp(14px,2vw,28px) clamp(14px,2.4vw,32px) clamp(14px,2vw,28px) clamp(8px,1vw,12px)}
.bg-kicker{font:600 11.5px/1.2 'Instrument Sans',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.bg-feature h2{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(24px,2.7vw,34px);line-height:1.12;letter-spacing:-.025em;text-wrap:balance}
.bg-feature p{margin:0;font-size:15.5px;line-height:1.6;color:var(--ink-68);max-width:52ch}
.bg-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;font-size:13px;color:var(--ink-60)}
.bg-read{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:var(--ink)}
.bg-read svg{transition:translate .35s var(--ease-soft)}
.bg-feature:hover .bg-read svg{translate:4px 0}

.bg-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:0;padding:0;list-style:none}
.bg-card{display:flex;flex-direction:column;height:100%;padding:6px;color:inherit;transition:transform .35s var(--ease-soft)}
.bg-card:hover{transform:translateY(-3px)}
.bg-card-img{display:block;overflow:hidden;border-radius:15px;aspect-ratio:5/3;background:var(--grey)}
.bg-card-img svg,.bg-feature-img svg{width:100%;height:100%}
.bg-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s var(--ease-soft)}
.bg-card:hover .bg-card-img img{transform:scale(1.04)}
.bg-card-body{display:grid;gap:8px;align-content:start;flex:1;padding:14px 12px 12px}
.bg-card b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;line-height:1.28;letter-spacing:-.01em;text-wrap:balance}
.bg-card-text{font-size:14px;line-height:1.55;color:var(--ink-68);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.bg-card .bg-meta{margin-top:auto;padding-top:4px}
.bg-foot{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:28px}
.bg-morebtn{border:0;padding:12px 22px;border-radius:999px;background:#fff;font:inherit;font-size:15px;font-weight:600;color:var(--ink);box-shadow:var(--card-shadow);cursor:pointer;transition:background-color .2s ease}
.bg-morebtn:hover{background:var(--green-soft)}
.bg-count{font-size:13px;color:var(--ink-60)}
.bg-empty{padding:28px;text-align:center;font-size:15px;color:var(--ink-68)}
.bg-datepill{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:18px 0 0;font-size:14px;color:var(--ink-68)}
.bg-datepill button{border:0;background:none;font:inherit;font-weight:600;color:var(--ink);text-decoration:underline;cursor:pointer;padding:0}

@media (max-width:980px){
  .bg-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .bg-feature{grid-template-columns:minmax(0,1fr)}
  .bg-feature-body{padding:8px 14px 16px}
}
@media (max-width:640px){
  .bg-grid{grid-template-columns:minmax(0,1fr);gap:10px}
  .bg-card{flex-direction:row;align-items:center}
  .bg-card-img{flex:none;width:108px;aspect-ratio:1/1;border-radius:14px}
  .bg-card-body{padding:6px 8px 6px 14px;gap:5px}
  .bg-card b{font-size:16px}
  .bg-card-text{display:none}
}
`;

const crumbs = [{ name: 'Blog' }];

export default function Blog({ mins }: { mins: Record<string, number> }) {
  const read = (p: BlogPost) => mins?.[p.slug] ?? p.readMins;
  useHomeMotion();
  const featured = posts.find((p: BlogPost) => p.featured);
  const [topic, setTopic] = useState('All');
  const [q, setQ] = useState('');
  const [date, setDate] = useState('');
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const t = qs.get('topic');
    if (t && blogCategories.includes(t)) setTopic(t);
    const d = qs.get('date');
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) setDate(d);
  }, []);
  const needle = q.trim().toLowerCase();
  const filtering = needle !== '' || topic !== 'All' || date !== '';
  const matches = useMemo(
    () => posts.filter((p) => (topic === 'All' || p.category === topic)
      && (!date || p.date === date)
      && (!needle || `${p.title} ${p.excerpt} ${p.category} ${author.name}`.toLowerCase().includes(needle))),
    [topic, needle, date],
  );
  const showFeatured = !filtering && featured;
  const grid = showFeatured ? matches.filter((p) => p.slug !== featured!.slug) : matches;
  const shownCount = Math.min(limit, grid.length);
  const pick = (t: string) => { setTopic(t); setLimit(PAGE); };
  const count = (t: string) => (t === 'All' ? posts.length : posts.filter((p) => p.category === t).length);

  return (
    <DcPage title="Blog — moving tips & London removal guides | Phi Movers" description={DESCRIPTION} path="/blog" crumbs={crumbs}>
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + KIT_CSS + GUIDES_CSS }} />
      <div className="pk">
        <section className="pk-hero">
          <div className="pk-wrap">
            <Breadcrumbs crumbs={crumbs} />
            <Eyebrow>Moving tips &amp; guides</Eyebrow>
            <h1 className="pk-h1 mo-title"><Words text={TITLE} /></h1>
            <p className="pk-hero-lead">{DESCRIPTION}</p>
            <div className="pk-find" role="search">
              <label className="pk-find-box">
                {kitIcon(SearchIcon, 20)}
                <span className="dc-sr">Search articles</span>
                <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder="Search articles…" autoComplete="off" />
                <PkSearchClear value={q} onClear={() => { setQ(''); setLimit(PAGE); }} />
                <span className="pk-find-count" aria-live="polite">{filtering ? `${matches.length} of ${posts.length}` : `${posts.length} guides`}</span>
              </label>
            </div>
            <ul className="pk-chips" aria-label="Filter articles by category">
              {blogCategories.map((t) => (
                <li key={t}>
                  <button type="button" aria-pressed={t === topic} onClick={() => pick(t)}>
                    {t}<small>{count(t)}</small>
                  </button>
                </li>
              ))}
            </ul>
            {date && (
              <p className="bg-datepill">Filtered by date: <time dateTime={date}><b>{date}</b></time> <button type="button" onClick={() => setDate('')}>Clear date</button></p>
            )}

            {showFeatured && (
              <a href={`/blog/${featured!.slug}`} className="pk-card bg-feature">
                <span className="bg-feature-img"><Cover post={featured!} eager /></span>
                <span className="bg-feature-body">
                  <span className="bg-kicker">Featured · {featured!.category}</span>
                  <h2>{featured!.title}</h2>
                  <p>{featured!.excerpt}</p>
                  <span className="bg-meta"><span>{author.name}</span><span aria-hidden="true">·</span><time dateTime={featured!.date}>{featured!.dateLabel}</time><span aria-hidden="true">·</span><span>{read(featured!)} min read</span></span>
                  <span className="bg-read">Read article {kitIcon(ArrowRightIcon, 16)}</span>
                </span>
              </a>
            )}
          </div>
        </section>

        <section className="pk-sec" aria-label="Articles">
          <div className="pk-wrap">
            {grid.length === 0 && !showFeatured ? (
              <div className="pk-card bg-empty">
                <p style={{ margin: 0, fontWeight: 600 }}>No articles found</p>
                <p style={{ margin: '4px 0 0' }}>Try a different search or category.</p>
                <button type="button" className="bg-morebtn" style={{ marginTop: 14 }} onClick={() => { setQ(''); setTopic('All'); setDate(''); setLimit(PAGE); }}>Clear filters</button>
              </div>
            ) : (
              <ul className="bg-grid">
                {grid.map((p, i) => (
                  <li key={p.slug} hidden={i >= limit} data-reveal="" style={{ '--i': i % 3 } as Vars}>
                    <a href={`/blog/${p.slug}`} className="pk-card bg-card">
                      <span className="bg-card-img"><Cover post={p} /></span>
                      <span className="bg-card-body">
                        <span className="bg-kicker">{p.category} · {read(p)} min read</span>
                        <b>{p.title}</b>
                        <span className="bg-card-text">{p.excerpt}</span>
                        <span className="bg-meta"><span>{author.name}</span><span aria-hidden="true">·</span><time dateTime={p.date}>{p.dateLabel}</time></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {grid.length > limit && (
              <div className="bg-foot">
                <button type="button" className="bg-morebtn" onClick={() => setLimit((n) => n + PAGE)}>Load more articles</button>
                <span className="bg-count" aria-live="polite">Showing {shownCount} of {grid.length}</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <CtaBand title="Moving soon? Start your free quote in under a minute." text="Fixed prices · All 32 London boroughs" />
    </DcPage>
  );
}
