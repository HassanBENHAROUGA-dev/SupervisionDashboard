import {importProvidersFrom, NgModule} from '@angular/core';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';

import { App } from './app';
import { Calendar } from './calendar/calendar';

import { AgGridModule } from 'ag-grid-angular';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {provideRouter, RouterModule} from '@angular/router';

const routes = [
  { path: '', component: App },
  { path: 'calendar', component: Calendar }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      AgGridModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      // Add BrowserModule is not needed, bootstrapApplication includes it
    ),
  ]
}).catch(err => console.error(err));
