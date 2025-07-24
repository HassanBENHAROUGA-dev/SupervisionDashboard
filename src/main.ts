import {bootstrapApplication} from '@angular/platform-browser';
import {App} from './app/app';
import {provideHttpClient} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule)
  ]
}).catch((err) => console.error(err));
