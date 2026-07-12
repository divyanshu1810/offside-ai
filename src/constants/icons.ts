import type { AndroidSymbol, SFSymbol } from 'expo-symbols';

export type AppIconName = {
  ios: SFSymbol;
  android: AndroidSymbol;
  web: AndroidSymbol;
};

export const AppIcons = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  matches: { ios: 'soccerball', android: 'sports_soccer', web: 'sports_soccer' },
  stats: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  ai: { ios: 'brain.head.profile', android: 'smart_toy', web: 'smart_toy' },
  profile: { ios: 'person.crop.circle.fill', android: 'person', web: 'person' },
  football: { ios: 'soccerball', android: 'sports_soccer', web: 'sports_soccer' },
  trophy: { ios: 'trophy.fill', android: 'trophy', web: 'trophy' },
  trendDown: {
    ios: 'chart.line.downtrend.xyaxis',
    android: 'trending_down',
    web: 'trending_down',
  },
  flag: { ios: 'flag.fill', android: 'flag', web: 'flag' },
  compare: { ios: 'arrow.left.arrow.right', android: 'compare_arrows', web: 'compare_arrows' },
  star: { ios: 'star.fill', android: 'star', web: 'star' },
  chat: { ios: 'bubble.left.fill', android: 'chat_bubble', web: 'chat_bubble' },
  child: { ios: 'figure.child', android: 'child_care', web: 'child_care' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  notifications: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
  theme: { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' },
  language: { ios: 'globe', android: 'language', web: 'language' },
  dataUsage: {
    ios: 'antenna.radiowaves.left.and.right',
    android: 'signal_cellular_alt',
    web: 'signal_cellular_alt',
  },
  about: { ios: 'info.circle.fill', android: 'info', web: 'info' },
  stadium: { ios: 'sportscourt.fill', android: 'stadium', web: 'stadium' },
  settings: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  analysis: { ios: 'brain', android: 'psychology', web: 'psychology' },
  event: { ios: 'doc.text.fill', android: 'assignment', web: 'assignment' },
  substitution: { ios: 'arrow.2.squarepath', android: 'swap_horiz', web: 'swap_horiz' },
  video: { ios: 'tv.fill', android: 'tv', web: 'tv' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  warning: {
    ios: 'exclamationmark.triangle.fill',
    android: 'warning',
    web: 'warning',
  },
  league: { ios: 'shield.fill', android: 'shield', web: 'shield' },
  send: { ios: 'paperplane.fill', android: 'send', web: 'send' },
  news: { ios: 'newspaper.fill', android: 'article', web: 'article' },
} satisfies Record<string, AppIconName>;
