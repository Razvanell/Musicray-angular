import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AuthService } from "../navbar/auth.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = this.authService.getToken() || '';

        if (token) {
            // Adding the Authorization header if a token is available
            request = request.clone({ 
                setHeaders: { 
                    Authorization: `Bearer ${token}` 
                }
            });
        }

        // Setting default headers if not already present
        if (!request.headers.has('Content-Type')) {
            request = request.clone({ 
                setHeaders: { 'Content-Type': 'application/json' } 
            });
        }
        
        request = request.clone({ 
            setHeaders: { 'Accept': 'application/json' } 
        });

        // Handle the request and log response, if successful
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('Response Event: ', event);
                }
                return event;
            }),
            
            // Handling errors and logging the reason and status
            catchError((error: HttpErrorResponse) => {
                const errorData = {
                    reason: error?.error?.reason || '',
                    status: error.status
                };
                console.error('Error Occurred:', errorData); // Optional: Add logging for the error
                return throwError(error); // Re-throw the error
            })
        );
    }
}
