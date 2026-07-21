import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  expandido: boolean = true;

  @HostBinding('class.recolhido') get isRecolhido() {
    return !this.expandido;
  }

  alternarTamanho(): void {
    this.expandido = !this.expandido;
  }
}