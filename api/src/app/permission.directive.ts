import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[permission]'
})
export class PermissionDirective {
  @Input() set appId(id: number) {
    this.checkIdInStorage(id);
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  private checkIdInStorage(id: number) {
    const data = JSON.parse(localStorage.getItem('permissions') || '[]');

    const idExists = data.some((item: any) => item.idPermissao === id);

    if (idExists) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
