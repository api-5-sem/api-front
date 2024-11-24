import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ComponentsModule } from './components/components.module';

import { HttpClientModule } from '@angular/common/http';
import { ModalConfigComponent } from './dashboard/modal-config/modal-config.component';
import { ModalExportComponent } from './dashboard/modal-export/modal-export.component';
import { ExportTemplateComponent } from './dashboard/export-template/export-template.component';
import { PermissionDirective } from './permission.directive';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ModalConfigComponent,
    ModalExportComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
