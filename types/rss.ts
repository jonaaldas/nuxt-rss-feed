export type NavItem = {
  title: string;
  url: string;
  items?: NavItem[];
  isActive?: boolean;
  id: string;
};
