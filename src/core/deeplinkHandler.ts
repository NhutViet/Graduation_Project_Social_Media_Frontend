import {Linking} from 'react-native';
import {navigationRef} from '../NavigationService';

// các query rác hay gặp
const JUNK = new Set([
  'fbclid',
  'zarsrc',
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'openExternalBrowser',
]);
// domain app của bạn
const APP_DOMAINS = new Set(['cirla.io.vn', 'www.cirla.io.vn']);

// ---- helpers ----
const cleanUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    // xoá hash
    u.hash = '';
    // xoá các query rác
    for (const k of Array.from(u.searchParams.keys())) {
      if (JUNK.has(k)) u.searchParams.delete(k);
    }
    return u.toString();
  } catch {
    const noHash = raw.split('#')[0];
    const [base, q = ''] = noHash.split('?');
    if (!q) return base;
    const kept = q
      .split('&')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(p => !JUNK.has(p.split('=')[0]));
    return kept.length ? `${base}?${kept.join('&')}` : base;
  }
};

const stripAppPrefix = (raw: string): string => {
  // 1) cirla://...
  const schemeIdx = raw.indexOf('://');
  if (schemeIdx > -1 && raw.slice(0, schemeIdx) === 'cirla') {
    return raw.slice(schemeIdx + 3).replace(/^\/+/, ''); // bỏ "cirla://" và slash đầu
  }
  // 2) https://cirla.io.vn/...
  try {
    const u = new URL(raw);
    if (APP_DOMAINS.has(u.hostname)) {
      const path = u.pathname.replace(/^\/+/, '');
      return path + (u.search || '');
    }
  } catch {}
  // 3) path thuần
  return raw.replace(/^\/+/, '');
};

const parseQuery = (qs: string): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!qs) return out;
  qs.split('&').forEach(kv => {
    const [k, v = ''] = kv.split('=');
    if (!k) return;
    out[decodeURIComponent(k)] = decodeURIComponent(v);
  });
  return out;
};

const resolveRoute = (rawUrl: string) => {
  const cleaned = cleanUrl(rawUrl);
  const stripped = stripAppPrefix(cleaned);

  const [pathOnly, qs = ''] = stripped.split('?');
  const query = parseQuery(qs);
  const seg = pathOnly.split('/').filter(Boolean).map(decodeURIComponent);

  if (seg[0] === 'home' && query.path) {
    const nested = stripAppPrefix(query.path);
    const [p2, qs2 = ''] = nested.split('?');
    const q2 = parseQuery(qs2);
    const s2 = p2.split('/').filter(Boolean).map(decodeURIComponent);
    return {route: s2[0], seg: s2, query: q2};
  }

  return {route: seg[0], seg, query};
};

// ---- public APIs ----
export const handleDeeplinkIfNeeded = async () => {
  const url = await Linking.getInitialURL();
  if (url) navigateFromUrl(url);
};

export const listenToDeeplink = () => {
  const handler = ({url}: {url: string}) => navigateFromUrl(url);
  const sub = Linking.addEventListener('url', handler);
  return () => {
    sub?.remove?.();
  };
};

export const navigateFromUrl = (rawUrl: string) => {
  try {
    const {route, seg, query} = resolveRoute(rawUrl);

    switch (route) {
      case 'profile': {
        const userID = seg[1] || query.userId || query.id;
        if (userID) {
          navigationRef.current?.navigate('ProfileComp', {userID});
        }
        break;
      }
      case 'share': {
        const postId = seg[1] || query.postId || query.id;
        if (postId) {
          navigationRef.current?.navigate('PostDetailScreen', {postId});
        }
        break;
      }
      case 'story': {
        const storyId = seg[1] || query.storyId;
        const creatorId = seg[2] || query.creatorId;
        if (storyId && creatorId) {
          navigationRef.current?.navigate('SeenStory', {storyId, creatorId});
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.warn('Invalid deep link:', rawUrl, e);
  }
};
