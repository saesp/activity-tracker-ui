import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, CreateActivity } from '../models/activity.model';

//Service responsabile delle chiamate HTTP verso l'API Activities

@Injectable({
  providedIn: 'root',
})
export class ActivityService { //this is the service that will be used to interact with the backend API to perform CRUD operations on activities. It uses HttpClient to make HTTP requests to the API endpoints

  //endpoint base API
  private apiUrl = 'https://localhost:7068/api/activities';

  constructor(private http: HttpClient) { } //the constructor injects the HttpClient service, which allows us to make HTTP requests to the backend API.

  //GET-READ
  getActivities() {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  //POST-CREATE
  postActivity(activity: CreateActivity) {
    return this.http.post<Activity>(this.apiUrl, activity);
  }
}