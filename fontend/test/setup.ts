import '@testing-library/jest-dom';

// Provide a minimal fetch mock helper; individual tests can override
if (!global.fetch) {
  // @ts-ignore
  global.fetch = (url: RequestInfo, opts?: RequestInit) => Promise.resolve(new Response(null, { status: 200 })) as any;
}
