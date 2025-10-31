declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'astro:transitions/client' {
  export function navigate(to: string): void;
}
