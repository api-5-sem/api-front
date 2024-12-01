import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
  permissions: number;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', permissions: 4, title: 'Dashboard', icon: 'design_app', class: '' },
  { path: '/key-indicators', permissions: 1, title: 'Indicadores Chave', icon: 'now-ui-icons business_briefcase-24', class: '' },
  { path: '/permissions', permissions: 5, title: 'Gerenciamento de Permissão', icon: 'now-ui-icons loader_gear', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };
}
