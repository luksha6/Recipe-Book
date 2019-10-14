import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import { environment } from "../../environments/environment";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // ? optional
}


@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {
    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIkey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(responseData => {
                const expirationDate = new Date(
                    new Date().getTime() + +responseData.expiresIn * 1000); // + ispred prebaci u broj
                const user = new User(
                    responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    expirationDate
                );
                this.user.next(user);
            })
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIkey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(
                    responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn)
            }));
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000); // + ispred prebaci u broj
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user)); // save userData in localStorage
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An uknown error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage)
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
        }
        return throwError(errorMessage);

    }
}
