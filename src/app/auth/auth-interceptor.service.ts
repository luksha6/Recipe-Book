import {Injectable} from "@angular/core";
import {
    HttpHandler,
    HttpInterceptor,
    HttpParams,
    HttpRequest
} from "@angular/common/http";

import {AuthService} from "./auth.service";
import {exhaustMap, take} from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            take(1), // take - take 1 value and unsubscribe
            exhaustMap(user => { //  exhaustMap - when first obs finish, it pass data to exhaustMap and replace take obs with new obs (exhaustMap)
                if (!user) {
                    return next.handle(req);
                }
                const modifiedRequest = req.clone(
                    {
                        params: new HttpParams().set('auth', user.token)
                    });
                return next.handle(modifiedRequest);
            })
        );


    }
}
