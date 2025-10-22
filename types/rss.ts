type NavItem = {
  title: string;
  url: string;
  items?: NavItem[];
  isActive?: boolean;
};

export default NavItem;
