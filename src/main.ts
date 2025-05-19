import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpConfigInterceptor } from './app/utils/http-config-interceptor'; // Adjust the path as needed

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([httpConfigInterceptor])
    ),
    provideRouter(appRoutes),
  ],
}).catch(err => console.error(err));
