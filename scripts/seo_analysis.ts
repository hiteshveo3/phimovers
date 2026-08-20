import { areas } from "../lib/areas";
import { allServices } from "../lib/data";
import { getComboCopy, PRIORITY_BOROUGHS, PRIORITY_SERVICES } from "../lib/combos";
import { buildServiceCopy } from "../lib/services";

// Visible text reconstruction helpers
function cleanText(text: string): string {
  return text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function tokenize(text: string): string[] {
  return cleanText(text).split(" ").filter(Boolean);
}

// 1. Set-based Jaccard
function getJaccard(wordsA: string[], wordsB: string[]): number {
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  const intersection = new Set(Array.from(setA).filter((x) => setB.has(x)));
  const union = new Set([...Array.from(setA), ...Array.from(setB)]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// 2. Multiset / Frequency Overlap
function getMultisetOverlap(wordsA: string[], wordsB: string[]): number {
  const countsA: Record<string, number> = {};
  const countsB: Record<string, number> = {};
  wordsA.forEach(w => countsA[w] = (countsA[w] || 0) + 1);
  wordsB.forEach(w => countsB[w] = (countsB[w] || 0) + 1);

  let intersectionCount = 0;
  const allKeys = new Set([...Object.keys(countsA), ...Object.keys(countsB)]);
  let unionCount = 0;

  allKeys.forEach(k => {
    const a = countsA[k] || 0;
    const b = countsB[k] || 0;
    intersectionCount += Math.min(a, b);
    unionCount += Math.max(a, b);
  });

  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

// 3. 2-gram overlap
function getNGramSimilarity(wordsA: string[], wordsB: string[], n = 2): number {
  const getNGrams = (words: string[]) => {
    const ngrams = [];
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(" "));
    }
    return ngrams;
  };
  const ngramsA = getNGrams(wordsA);
  const ngramsB = getNGrams(wordsB);
  const setA = new Set(ngramsA);
  const setB = new Set(ngramsB);
  const intersection = new Set(Array.from(setA).filter(x => setB.has(x)));
  const union = new Set([...Array.from(setA), ...Array.from(setB)]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Token Normalization Helper
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  
  // Remove boroughs
  areas.forEach(a => {
    normalized = normalized.replace(new RegExp(a.name.toLowerCase(), "g"), "[borough]");
    normalized = normalized.replace(new RegExp(a.slug.toLowerCase().replace(/-/g, " "), "g"), "[borough]");
    normalized = normalized.replace(new RegExp(a.slug.toLowerCase(), "g"), "[borough]");
  });

  // Remove services
  allServices.forEach(s => {
    normalized = normalized.replace(new RegExp(s.title.toLowerCase(), "g"), "[service]");
    normalized = normalized.replace(new RegExp(s.slug.toLowerCase().replace(/-/g, " "), "g"), "[service]");
    normalized = normalized.replace(new RegExp(s.slug.toLowerCase(), "g"), "[service]");
  });

  // Remove brand, phone numbers, urls, prices
  normalized = normalized
    .replace(/phi movers/g, "[brand]")
    .replace(/phi movers ltd/g, "[brand]")
    .replace(/\+44\s*\d+\s*\d+\s*\d+/g, "[phone]")
    .replace(/info@phimovers\.co\.uk/g, "[email]")
    .replace(/https?:\/\/[^\s]+/g, "[url]")
    .replace(/from\s*£\d+(?:\/\s*h(?:ou)?r)?/gi, "[price]")
    .replace(/£\d+/g, "[price]");

  return normalized;
}

// Page content reconstructor (visible body text only)
function reconstructComboPage(boroughSlug: string, serviceSlug: string): string {
  const area = areas.find(a => a.slug === boroughSlug);
  const svcEntry = allServices.find(s => s.slug === serviceSlug);
  if (!area || !svcEntry) return "";

  const combo = getComboCopy(area, svcEntry);
  const copy = buildServiceCopy(svcEntry, area.name);

  return [
    `${svcEntry.title} in ${area.name}`, // H1
    combo.hero, // Hero Paragraph
    ...combo.intro, // Intro paragraphs
    ...copy.intro, // Service specific intro paragraphs
    ...copy.included, // Included features list
    ...copy.idealFor, // Ideal for list
    ...copy.steps.map(s => s.title + " " + s.body), // Process steps
    ...copy.affects, // Price factors
    area.housing, // Local housing box
    area.access, // Local access box
    combo.tip, // Local tip
    ...copy.faqs.map(f => f.q + " " + f.a) // FAQs
  ].join("\n");
}

function runAnalysis() {
  console.log("=== DETAILED SEO MATHEMATICAL VERIFICATION ===");

  // 1. COMPARING 5 SPECIFIC PAIRS (House Removals)
  const targets = ["camden", "westminster", "bromley", "richmond-upon-thames", "croydon"];
  console.log("\n--- PAIRWISE HOUSE REMOVALS ANALYSIS ---");
  console.log("Calculations use clean tokenization (all punctuation removed, split by spaces, lowercased).");
  
  const pairs: [string, string][] = [];
  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      pairs.push([targets[i], targets[j]]);
    }
  }

  pairs.forEach(([slugA, slugB]) => {
    const textA = reconstructComboPage(slugA, "house-removals");
    const textB = reconstructComboPage(slugB, "house-removals");

    const tokensA = tokenize(textA);
    const tokensB = tokenize(textB);

    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    const setIntersect = new Set(Array.from(setA).filter(x => setB.has(x)));
    const setUnion = new Set([...Array.from(setA), ...Array.from(setB)]);

    const jaccard = setIntersect.size / setUnion.size;

    console.log(`\nPair: ${slugA} vs ${slugB}`);
    console.log(`  - Page A Tokens: ${tokensA.length} (Unique: ${setA.size})`);
    console.log(`  - Page B Tokens: ${tokensB.length} (Unique: ${setB.size})`);
    console.log(`  - Intersection of Unique Sets: ${setIntersect.size}`);
    console.log(`  - Union of Unique Sets: ${setUnion.size}`);
    console.log(`  - Set Jaccard: ${(jaccard * 100).toFixed(2)}%`);
    
    // Normalized
    const normA = tokenize(normalizeText(textA));
    const normB = tokenize(normalizeText(textB));
    const normSetA = new Set(normA);
    const normSetB = new Set(normB);
    const normIntersect = new Set(Array.from(normSetA).filter(x => normSetB.has(x)));
    const normUnion = new Set([...Array.from(normSetA), ...Array.from(normSetB)]);
    const normJaccard = normIntersect.size / normUnion.size;
    console.log(`  - Normalized Set Jaccard: ${(normJaccard * 100).toFixed(2)}%`);

    // Multiset overlap
    const msOverlap = getMultisetOverlap(tokensA, tokensB);
    const normMsOverlap = getMultisetOverlap(normA, normB);
    console.log(`  - Multiset/Frequency Overlap: ${(msOverlap * 100).toFixed(2)}%`);
    console.log(`  - Normalized Multiset Overlap: ${(normMsOverlap * 100).toFixed(2)}%`);

    // 2-gram Overlap
    const bgOverlap = getNGramSimilarity(tokensA, tokensB, 2);
    const normBgOverlap = getNGramSimilarity(normA, normB, 2);
    console.log(`  - Bigram Set Overlap: ${(bgOverlap * 100).toFixed(2)}%`);
    console.log(`  - Normalized Bigram Set Overlap: ${(normBgOverlap * 100).toFixed(2)}%`);
  });

  // 2. SAME BOROUGH / DIFFERENT SERVICES
  console.log("\n--- SAME BOROUGH (CAMDEN) / DIFFERENT SERVICES ---");
  const services = ["house-removals", "office-removals", "man-and-van", "full-packing-service"];
  const servicePairs: [string, string][] = [];
  for (let i = 0; i < services.length; i++) {
    for (let j = i + 1; j < services.length; j++) {
      servicePairs.push([services[i], services[j]]);
    }
  }

  servicePairs.forEach(([sA, sB]) => {
    const textA = reconstructComboPage("camden", sA);
    const textB = reconstructComboPage("camden", sB);

    const tokensA = tokenize(textA);
    const tokensB = tokenize(textB);

    const jaccard = getJaccard(tokensA, tokensB);
    const msOverlap = getMultisetOverlap(tokensA, tokensB);

    console.log(`Camden [${sA}] vs [${sB}]:`);
    console.log(`  - Set Jaccard: ${(jaccard * 100).toFixed(2)}%`);
    console.log(`  - Multiset Overlap: ${(msOverlap * 100).toFixed(2)}%`);
  });

  // 3. STATISTICAL DISTRIBUTION OVER ALL 96 PRIORITY COMBOS
  console.log("\n--- 96 PRIORITY COMBOS STATISTICAL DISTRIBUTION ---");
  const priorityCombos: { borough: string; service: string }[] = [];
  for (const b of PRIORITY_BOROUGHS) {
    for (const s of PRIORITY_SERVICES) {
      priorityCombos.push({ borough: b, service: s });
    }
  }

  const allJaccards: number[] = [];
  const allMultisets: number[] = [];
  let pairCount = 0;

  for (let i = 0; i < priorityCombos.length; i++) {
    for (let j = i + 1; j < priorityCombos.length; j++) {
      const cA = priorityCombos[i];
      const cB = priorityCombos[j];
      
      // We only compare combos of the same service across different boroughs to test the duplication risk of regional landings!
      if (cA.service !== cB.service) continue;

      const textA = reconstructComboPage(cA.borough, cA.service);
      const textB = reconstructComboPage(cB.borough, cB.service);

      const tokensA = tokenize(textA);
      const tokensB = tokenize(textB);

      allJaccards.push(getJaccard(tokensA, tokensB));
      allMultisets.push(getMultisetOverlap(tokensA, tokensB));
      pairCount++;
    }
  }

  allJaccards.sort((a, b) => a - b);
  allMultisets.sort((a, b) => a - b);

  const mean = allJaccards.reduce((a, b) => a + b, 0) / allJaccards.length;
  const median = allJaccards[Math.floor(allJaccards.length / 2)];
  const min = allJaccards[0];
  const max = allJaccards[allJaccards.length - 1];

  console.log(`Total compared pairs of same-service different-boroughs: ${pairCount}`);
  console.log(`  - Min Similarity: ${(min * 100).toFixed(2)}%`);
  console.log(`  - Max Similarity: ${(max * 100).toFixed(2)}%`);
  console.log(`  - Mean Similarity: ${(mean * 100).toFixed(2)}%`);
  console.log(`  - Median Similarity: ${(median * 100).toFixed(2)}%`);
  
  // Histogram
  const ranges = [0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0];
  const distribution = Array(ranges.length - 1).fill(0);
  allJaccards.forEach(v => {
    for (let r = 0; r < ranges.length - 1; r++) {
      if (v >= ranges[r] && v < ranges[r + 1]) {
        distribution[r]++;
        break;
      }
      if (v === 1.0 && r === ranges.length - 2) {
        distribution[r]++;
      }
    }
  });

  console.log("\nSimilarity Range Distribution of Same-Service Pairs:");
  for (let r = 0; r < ranges.length - 1; r++) {
    console.log(`  ${(ranges[r]*100).toFixed(0)}% - ${(ranges[r+1]*100).toFixed(0)}%: ${distribution[r]} pairs`);
  }

  // 4. BOROUGH HUBS VERIFICATION
  console.log("\n--- BOROUGH HUBS AUDIT ---");
  const hubData = areas.map(a => {
    const uniqueText = `${a.name} ${a.blurb} ${a.housing} ${a.access} ${a.faqs.map(f => f.q + " " + f.a).join(" ")}`;
    const normalizedUniqueText = normalizeText(uniqueText);
    const uniqueTokens = tokenize(normalizedUniqueText);
    return {
      name: a.name,
      uniqueTokensCount: uniqueTokens.length
    };
  });
  console.table(hubData);
}

runAnalysis();
