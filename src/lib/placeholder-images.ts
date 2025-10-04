export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = [
    {
      "id": "hero-background",
      "description": "A winding road through mountains at sunrise, representing a career path.",
      "imageUrl": "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "imageHint": "path journey"
    },
    {
      "id": "role-selector-background",
      "description": "A person standing at a crossroad with multiple paths extending into a stylized, abstract landscape.",
      "imageUrl": "https://images.unsplash.com/photo-1554629947-334ff61d85dc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "imageHint": "choices paths"
    }
  ];
