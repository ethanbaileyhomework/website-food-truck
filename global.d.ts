declare module "*.yml" {
  const content: string;
  export default content;
}

declare module "*.yaml" {
  const content: string;
  export default content;
}

declare global {
  interface Window {
    CMS?: {
      init: (options: { config: unknown }) => void;
    };
    CMS_MANUAL_INIT?: boolean;
    __decapInitialized?: boolean;
  }
}

export {};
