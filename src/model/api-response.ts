import { Injectable } from "@angular/core";

Injectable({
    providedIn: 'root',
});
export interface IApiResponse<T>{
    data: T;
    isSuccess: boolean;
    errorMessage: string;
}