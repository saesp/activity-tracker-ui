import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private apiUrl = 'https://localhost:7068/api/categories';

    constructor(private http: HttpClient) { }

    //GET-READ
    getCategories() {
        return this.http.get<Category[]>(this.apiUrl);
    }
}