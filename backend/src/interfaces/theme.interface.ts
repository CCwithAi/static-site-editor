export interface ThemeConfig {
  id?: string;
  name: string;
  description: string;
  version: string;
  author: string;
  styles: {
    global?: string;
    components?: {
      [key: string]: string;
    };
  };
  templates: {
    [key: string]: string;
  };
  created: Date;
  modified: Date;
}

export interface ThemeCreateDTO {
  name: string;
  description: string;
  author: string;
}
