import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';  // Import the routes from the new `app.routes.ts`
import { AppComponent } from './app/app.component';  // Your standalone app component
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),  // Provide the routing configuration
  ],
}).catch(err => console.error(err));
